import zmq

context = zmq.Context()

socket = context.socket(zmq.REQ)
socket.connect("tcp://localhost:98765")

for i in range(1, 10):
    socket.send_string("Saying hello from python")

    message = socket.recv()
    print("Received reply from server:", message)



