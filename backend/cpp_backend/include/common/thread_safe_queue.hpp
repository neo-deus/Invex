#pragma once

#include <common/common.hpp>

namespace investnest
{
    template<typename T, typename Func>
    class thread_safe_queue
    {

    protected:
        std::deque<T> deQueue;
        std::condition_variable cv;
        std::mutex mux;

        Func comparison_func;

    public:
        thread_safe_queue(const Func& comparison_func)
            : comparison_func(comparison_func)
        {}

        thread_safe_queue(const thread_safe_queue<T, Func>&) = delete;
        thread_safe_queue& operator=(const thread_safe_queue<T, Func>&) = delete;

        virtual ~thread_safe_queue()
        {
            clear();
        }

    public:
        T& front()
        {
            std::scoped_lock lock(mux);
            return deQueue.front();
        }

        T& back()
        {
            std::scoped_lock lock(mux);
            return deQueue.back();
        }

        void sort()
        {
            std::scoped_lock lock(mux);
            std::sort(deQueue.begin(), deQueue.end(), comparison_func);
        }

        void push_back(const T& item)
        {

            {
                std::unique_lock<std::mutex> ul(mux);
                deQueue.push_back(item);
            }
            
            cv.notify_one(); // Notifies using condition variable that item is available to be consumed
        }

        void push_front(const T& item)
        {
            {
                std::unique_lock<std::mutex> ul(mux);
                deQueue.push_front(item);
            }

            cv.notify_one(); // Notifies using condition variable that item is available to be consumed
        }

        // Returns no.of items in Queue
        std::size_t count()
        {
            std::scoped_lock lock(mux);
            return deQueue.size();
        }

        // Clears Queue
        void clear()
        {
            std::scoped_lock lock(mux);
            deQueue.clear();
        }

        T pop_front()
        {
            std::unique_lock<std::mutex> gaurd{mux};

            cv.wait(gaurd, [&]()
            {
                return !deQueue.empty();
            }); /* wait till deQueue is not empty */

            // Mutex lock acquired here, just before accessing the deque
            auto t = std::move(deQueue.front());
            deQueue.pop_front();

            return t; // RVO
        }// mutex unlocked here

        bool empty()
        {
            std::scoped_lock lock(mux);
            return deQueue.empty();
        }

    };
}

