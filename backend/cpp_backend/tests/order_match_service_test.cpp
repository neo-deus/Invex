#include <order_match_service/order_match_service.hpp>

using namespace investnest;

auto g_base_time = std::chrono::high_resolution_clock::now();

int f1()
{
    OrderMatchService hdfc_bank_order_match_service("HDFC_BANK");

    Order order1(OrderType::BUY, 43.34, 4, 1, g_base_time + std::chrono::milliseconds(1));
    Order order2(OrderType::BUY, 56.55, 6, 2, g_base_time + std::chrono::milliseconds(2));

    Order order3(OrderType::SELL, 89.78, 2, 3, g_base_time + std::chrono::milliseconds(3));
    Order order4(OrderType::SELL, 563.78, 8, 4, g_base_time + std::chrono::milliseconds(4));

    hdfc_bank_order_match_service.add_to_incoming_order(std::move(order1));
    hdfc_bank_order_match_service.add_to_incoming_order(std::move(order3));
    hdfc_bank_order_match_service.add_to_incoming_order(std::move(order4));
    hdfc_bank_order_match_service.add_to_incoming_order(std::move(order2));

    Order order5(OrderType::BUY, 89.78, 2, 5, g_base_time + std::chrono::milliseconds(5));
    hdfc_bank_order_match_service.add_to_incoming_order(std::move(order5));

    hdfc_bank_order_match_service.process();

    if(hdfc_bank_order_match_service.get_stock_price() == 89.78)
    {
        return 1;
    }
    else
    {
        return 0;
    }  
}

int multiple_matches_test()
{
    OrderMatchService order_service("HDFC_BANK");

    Order buy_order1(OrderType::BUY, 20.00, 10, 1, g_base_time + std::chrono::milliseconds(1));
    Order buy_order2(OrderType::BUY, 20.00, 10, 2, g_base_time + std::chrono::milliseconds(2));
    Order sell_order(OrderType::SELL, 20.00, 20, 3, g_base_time + std::chrono::milliseconds(3));

    order_service.add_to_incoming_order(std::move(buy_order1));
    order_service.add_to_incoming_order(std::move(buy_order2));
    order_service.add_to_incoming_order(std::move(sell_order));

    order_service.process();

    return order_service.get_stock_price() == 20.00 ? 1 : 0;
}

int multiple_buyers_sellers_test()
{
    OrderMatchService order_service("HDFC_BANK");

    Order buy_order1(OrderType::BUY, 35.00, 10, 1, g_base_time + std::chrono::milliseconds(1));
    Order buy_order2(OrderType::BUY, 35.50, 10, 2, g_base_time + std::chrono::milliseconds(2));
    Order sell_order1(OrderType::SELL, 35.00, 15, 3, g_base_time + std::chrono::milliseconds(3));
    Order sell_order2(OrderType::SELL, 34.75, 5, 4, g_base_time + std::chrono::milliseconds(4));

    order_service.add_to_incoming_order(std::move(buy_order1));
    order_service.add_to_incoming_order(std::move(buy_order2));
    order_service.add_to_incoming_order(std::move(sell_order1));
    order_service.add_to_incoming_order(std::move(sell_order2));

    order_service.process();

    int a = order_service.get_number_of_matches();
    std::cout << a << std::endl;

    return order_service.get_number_of_matches() == 2 ? 1 : 0;
}

int high_frequency_orders_test()
{
    OrderMatchService order_service("HDFC_BANK");
    
    for (int i = 1; i <= 100; ++i)
    {
        Order buy_order(OrderType::BUY, 55.00, 1, i, g_base_time + std::chrono::milliseconds(i));
        order_service.add_to_incoming_order(std::move(buy_order));
    }

    for (int i = 101; i <= 200; ++i)
    {
        Order sell_order(OrderType::SELL, 55.00, 1, i, g_base_time + std::chrono::milliseconds(i));
        order_service.add_to_incoming_order(std::move(sell_order));
    }

    order_service.process();

    int a = order_service.get_number_of_matches();
    std::cout << a << std::endl;

    return order_service.get_number_of_matches() == 100? 1 : 0;
}

int price_overlaps_test()
{
    OrderMatchService order_service("HDFC_BANK");

    Order buy_order(OrderType::BUY, 75.00, 5, 1,g_base_time + std::chrono::milliseconds(1));
    Order sell_order1(OrderType::SELL, 70.00, 5, 2, g_base_time + std::chrono::milliseconds(2));
    Order sell_order2(OrderType::SELL, 76.00, 5, 3, g_base_time + std::chrono::milliseconds(3));

    order_service.add_to_incoming_order(std::move(buy_order));
    order_service.add_to_incoming_order(std::move(sell_order2));
    order_service.add_to_incoming_order(std::move(sell_order1));

    order_service.process();

    // Check if lower price sell order matches first
    return order_service.get_stock_price() == 70.00 ? 1 : 0;
}



int main()
{
    if(high_frequency_orders_test() == 0)
    {
        std::cout<<"high_frequency_orders_test function failed\n";
    }
    else
    {
        std::cout<<"high_frequency_orders_test function passed\n";
    }

    return 0;
}