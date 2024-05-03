#include <stock_service/stock_service.hpp>

using namespace investnest;

int main()
{
    StockService ss;

    OrderMatchService* hdfc_service = ss.stocks_map["hdfc"].get();
    OrderMatchService* reliance_service = ss.stocks_map["reliance"].get();
    OrderMatchService* airtel_service = ss.stocks_map["airtel"].get();
    OrderMatchService* tata_service = ss.stocks_map["tata"].get();

    auto base_time = std::chrono::high_resolution_clock::now();
    
    for (int i = 1; i <= 100; ++i)
    {
        Order buy_order(OrderType::BUY, 55.00, 1, i, base_time + std::chrono::milliseconds(i));
        hdfc_service->add_to_incoming_order(std::move(buy_order));
    }

    for (int i = 101; i <= 200; ++i)
    {
        Order sell_order(OrderType::SELL, 55.00, 1, i, base_time + std::chrono::milliseconds(i));
        hdfc_service->add_to_incoming_order(std::move(sell_order));
    }

    for (int i = 1; i <= 100; ++i)
    {
        Order buy_order(OrderType::BUY, 55.00, 1, i, base_time + std::chrono::milliseconds(i));
        reliance_service->add_to_incoming_order(std::move(buy_order));
    }

    for (int i = 101; i <= 200; ++i)
    {
        Order sell_order(OrderType::SELL, 55.00, 1, i, base_time + std::chrono::milliseconds(i));
        reliance_service->add_to_incoming_order(std::move(sell_order));
    }

    for (int i = 1; i <= 100; ++i)
    {
        Order buy_order(OrderType::BUY, 55.00, 1, i, base_time + std::chrono::milliseconds(i));
        airtel_service->add_to_incoming_order(std::move(buy_order));
    }

    for (int i = 101; i <= 200; ++i)
    {
        Order sell_order(OrderType::SELL, 55.00, 1, i, base_time + std::chrono::milliseconds(i));
        airtel_service->add_to_incoming_order(std::move(sell_order));
    }

    for (int i = 1; i <= 100; ++i)
    {
        Order buy_order(OrderType::BUY, 55.00, 1, i, base_time + std::chrono::milliseconds(i));
        tata_service->add_to_incoming_order(std::move(buy_order));
    }

    for (int i = 101; i <= 200; ++i)
    {
        Order sell_order(OrderType::SELL, 55.00, 1, i, base_time + std::chrono::milliseconds(i));
        tata_service->add_to_incoming_order(std::move(sell_order));
    }

    ss.process_start();

    ss.run(); // blocking

    return 0;
}