using System.Net;
using System.Net.WebSockets;
using System.Text;

var clients = new List<WebSocket>();

var listener = new HttpListener();
listener.Prefixes.Add("http://localhost:8080/");
listener.Start();

Console.WriteLine("WebSocket server running on port 8080");

while (true)
{
    var context = await listener.GetContextAsync();

    if (context.Request.IsWebSocketRequest)
    {
        var wsContext = await context.AcceptWebSocketAsync(null);
        var socket = wsContext.WebSocket;

        clients.Add(socket);

        Console.WriteLine("Client connected");

        _ = Receive(socket);
    }
}

async Task Receive(WebSocket socket)
{
    byte[] buffer = new byte[1024];

    while (socket.State == WebSocketState.Open)
    {
        var result = await socket.ReceiveAsync(
            buffer,
            CancellationToken.None
        );

        string message = Encoding.UTF8.GetString(
            buffer,
            0,
            result.Count
        );

        Console.WriteLine(message);

        // Send movement data to everyone else
        foreach (var client in clients)
        {
            if (client != socket &&
                client.State == WebSocketState.Open)
            {
                await client.SendAsync(
                    Encoding.UTF8.GetBytes(message),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None
                );
            }
        }
    }
}