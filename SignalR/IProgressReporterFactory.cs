using System;

namespace SignalRDemo.SignalR
{
    public interface IProgressReporterFactory
    {
        IProgress<double> GetLoadingBarReporter(string connectionId);
    }
}