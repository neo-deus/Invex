#pragma once

#include <common/common.hpp>

namespace investnest
{

    /*  OrderBook and OrderMatchService will be unique for every stock 
        While a thread is sleeping or waiting, the thread pool manager is responsible for 
        monitoring the state of the threads and managing their availability. When new tasks 
        are scheduled or existing tasks complete, the thread pool manager wakes up sleeping 
        threads or assigns new tasks to available threads as needed
    */
    enum class OrderType
    {
        BUY,
        SELL
    };

    class Trade
    {
        public:
            Trade(uint16_t seller_user_ID, uint16_t buyer_user_ID, double price, uint16_t quantity)
                : seller_user_ID(seller_user_ID), buyer_user_ID(buyer_user_ID), price(price), quantity(quantity)
            {}
        private:
            uint16_t seller_user_ID{};
            uint16_t buyer_user_ID{};
            double price{};
            uint16_t quantity{};
    };

    struct Order
    {
        OrderType type{};
        double price{};
        uint16_t quantity{};
        uint16_t user_ID{};
        std::chrono::high_resolution_clock::time_point timestamp;  // High-resolution timestamp

        Order(OrderType type, double price, uint16_t quantity, uint16_t user_ID,const std::chrono::high_resolution_clock::time_point& timestamp)
            : type(type), price(price), quantity(quantity), user_ID(user_ID), timestamp(timestamp)
        {}
            
    };

    class OrderMatchService
    {

        /* Every stock is related to a OrderBook and OrderMatchService */

    public:

        OrderMatchService(const std::string& name)
            : trade_count(0), name(name) {}

        OrderMatchService(const OrderMatchService&) = delete;
        OrderMatchService& operator=(const OrderMatchService&) = delete;

        int get_number_of_matches()
        {
            std::scoped_lock lock(mux);
            return trade_count;
        }

        double get_stock_price()
        {
            std::scoped_lock ul(mux);
            return stock_price;
        }

        void add_to_incoming_order(const Order& order)
        {
            std::scoped_lock ul(mux);
            incoming_orders.push(order);
        }

        void process()
        {
            /*
            while(true)
            {
               this->pop_from_incoming_order();
            }
            */

            while(!incoming_orders.empty())
            {
                this->pop_from_incoming_order();
            }
        }

    private:

        void pop_from_incoming_order()
        {
            std::unique_lock<std::mutex> gaurd{mux};

            cv.wait(gaurd, [&]()
            {
                return !incoming_orders.empty();
            }); /* wait till incoming_orders is not empty */

            /* Mutex lock acquired here, just before accessing the deque*/
            auto t = std::move(incoming_orders.front());
            incoming_orders.pop();

            this->match(std::move(t));
            
        }/* mutex will be unlocked */

        static std::string formatTime(const std::chrono::high_resolution_clock::time_point& time_point)
        {
            auto timeT = std::chrono::system_clock::to_time_t(std::chrono::time_point_cast<std::chrono::system_clock::duration>(time_point));
            long long int millis = std::chrono::duration_cast<std::chrono::milliseconds>(time_point.time_since_epoch()).count() % 1000;

            struct tm * dt; char buffer[30];

            dt = localtime(&timeT);
            strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", dt);

            char currentTime[84] = "";
            sprintf(currentTime, "%s.%03lld", buffer, millis);

            return std::string(currentTime);
        }

        void match(Order&& order)
        {
            if(order.type == OrderType::BUY)
            {
                while(
                        !asks.empty() && 
                        order.quantity > 0 && 
                        order.price >= asks.front().price && 
                        order.user_ID != asks.front().user_ID
                )
                {

                    Order& ask_order = asks.front();
                    auto fill_quantity = std::min(order.quantity, ask_order.quantity);
                    
                    /* seller , buyer */

                    msg << name << " Trade Executed at: " << OrderMatchService::formatTime(ask_order.timestamp)  << ": Buy User " << order.user_ID
                      << " buys " << fill_quantity << " shares from Sell User " << ask_order.user_ID
                      << " at $" << ask_order.price << "\n";
                    std::cout << msg.str();
                    
                    order.quantity -= fill_quantity;
                    ask_order.quantity -= fill_quantity;

                    trades_happened.emplace_back(Trade{ask_order.user_ID, order.user_ID, order.price, fill_quantity});
                    trade_count++;
                    stock_price = order.price;

                    if(ask_order.quantity == 0)
                    {
                        asks.pop_front();
                        /* NO NEED TO SORT HERE */
                        /** Send HTTP call */
                    }
                }
                if(order.quantity > 0)
                {
                    bids.push_back(order);
                    std::sort(bids.begin(), bids.end(), [](const Order& a, const Order& b){
                        // Function to compare for sorting bids: descending price, then ascending time
                        if (a.price == b.price) return a.timestamp < b.timestamp;
                        return a.price > b.price;
                    });
                    /* Send HTTP call */
                }
            }
            else
            {
                
                while(
                        !bids.empty() && 
                        order.quantity > 0 && 
                        order.price <= bids.front().price &&
                        order.user_ID != bids.front().user_ID
                )
                {

                    Order& bid_order = bids.front();
                    auto fill_quantity = std::min(order.quantity, bid_order.quantity);

                    msg << name << " Trade Executed at : " << OrderMatchService::formatTime(bid_order.timestamp)  << " Sell User " << order.user_ID
                      << " sells " << fill_quantity << " shares to Buy User " << bid_order.user_ID
                      << " at $" << bid_order.price << "\n";

                    std::cout << msg.str();

                    order.quantity -= fill_quantity;
                    bid_order.quantity -= fill_quantity;

                    trades_happened.emplace_back(Trade{order.user_ID, bid_order.user_ID, order.price, fill_quantity});
                    trade_count++;
                    stock_price = order.price;

                    if(bid_order.quantity == 0)
                    {
                        bids.pop_front();
                        /* NO NEED TO SORT HERE */

                        /** Send HTTP call */
                    }
                }
                if(order.quantity > 0)
                {
                    asks.push_back(order);
                    std::sort(asks.begin(), asks.end(), [](const Order& a, const Order& b){
                        // Function to compare for sorting asks: ascending price, then ascending time
                        if (a.price == b.price) return a.timestamp < b.timestamp;
                        return a.price < b.price;
                    });
                    /** Send HTTP call */
                }
            }
        }

        private:
            std::mutex mux{};
            std::condition_variable cv{};
            std::vector<Trade> trades_happened{};
            int trade_count{0};
            double stock_price{};
            std::string name;

            std::stringstream msg;

            std::queue<Order> incoming_orders{};
            std::deque<Order> bids{};
            std::deque<Order> asks{};
    };
    
}
