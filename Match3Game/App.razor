@using Microsoft.AspNetCore.Components.Routing
@using Microsoft.JSInterop
@using Match3Game.Core
@inject IJSRuntime JS

<Router AppAssembly="@typeof(Program).Assembly">
    <Found Context="routeData">
        <RouteView RouteData="@routeData" />
    </Found>
    <NotFound>
        <p>Страница не найдена.</p>
    </NotFound>
</Router>

@code {
    private DotNetObjectReference<App>? objRef;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            objRef = DotNetObjectReference.Create(this);
            await JS.InvokeVoidAsync("initTonConnect", objRef);
        }
    }

    [JSInvokable]
    public void OnWalletConnected(string realAddress)
    {
        GameHistoryService.WalletAddress = realAddress;
    }

    [JSInvokable]
    public void OnWalletDisconnected()
    {
        GameHistoryService.WalletAddress = "";
        GameHistoryService.IsRegistered = false;
        GameHistoryService.UserName = "Гость";
    }

    public void Dispose()
    {
        objRef?.Dispose();
    }
}

<style>
    html, body {
        margin: 0;
        padding: 0;
        background-color: #1a1a1a;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: white;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
</style>
