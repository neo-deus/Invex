import zmq

context = zmq.Context()

subcriber = context.socket(zmq.SUB)
subcriber.setsockopt_string(zmq.SUBSCRIBE, "")
subcriber.connect("tcp://localhost:98765")

for i in range(1, 10):
    # subcriber.send_string("Saying hello from python")

    message = subcriber.recv()
    print("Received reply from server:", message)



