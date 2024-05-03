#include <iostream>
#include <zmq.hpp>

int main()
{
    zmq::context_t ctx(1);
    zmq::socket_t socket(ctx, zmq::socket_type::rep);

    socket.bind("tcp://localhost:98765");

    for(;;)
    {
        zmq::message_t request;
        auto res = socket.recv(request, zmq::recv_flags::none);
        std::string replyMessage = std::string(static_cast<char *>(request.data()), request.size());
        std::cout << "Received from client: " + replyMessage << std::endl;

        sleep(1);

        std::string msgToClient("greeting from C++");
        zmq::message_t reply(msgToClient.c_str(), msgToClient.size());
        socket.send(std::move(reply), zmq::send_flags::none);
    }
    
    // std::string name = "Nirmal";
    // zmq::message_t msg(name.c_str(), name.size());
    // socket.send(std::move(msg), zmq::send_flags::none);

    return 0;
}