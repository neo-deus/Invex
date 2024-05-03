#pragma once

#include <common/common.hpp>
#include <order_match_service/order_match_service.hpp>

namespace investnest
{
    struct StockService
    {
        StockService()
        {
            auto hdfc_bank_match_service = std::make_unique<OrderMatchService>("HDFC_BANK");
            auto reliance_match_service = std::make_unique<OrderMatchService>("RELIANCE");
            auto airtel_match_service = std::make_unique<OrderMatchService>("AIRTEL");
            auto tata_match_service = std::make_unique<OrderMatchService>("TATA");

            stocks_map["hdfc"] = std::move(hdfc_bank_match_service);
            stocks_map["reliance"] = std::move(reliance_match_service);
            stocks_map["airtel"] = std::move(airtel_match_service);
            stocks_map["tata"] = std::move(tata_match_service);
        }

        void process_start()
        {
           for(const auto& item: stocks_map)
            {
                boost::asio::post(pool, std::bind(&OrderMatchService::process, item.second.get()));
            } 
        }

        // blocking function
        void run()
        {
            pool.join(); // blocking function
        }

        std::unordered_map<std::string, std::unique_ptr<OrderMatchService>> stocks_map;
        boost::asio::thread_pool pool{3};
    };

}