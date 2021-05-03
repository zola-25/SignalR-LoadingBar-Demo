using Microsoft.AspNetCore.SignalR;
using System;

namespace SignalRDemo.SignalR
{
    public class ProgressReporterFactory : IProgressReporterFactory
    {
        private readonly IHubContext<LoadingBarHub> _progressHubContext;

        public ProgressReporterFactory(IHubContext<LoadingBarHub> progressHubContext)
        {
            _progressHubContext = progressHubContext;
        }

        public IProgress<double> GetLoadingBarReporter(string connectionId)
        {
            if (connectionId == null)
            {
                // if no connection allow reporting of progress just don't do anything with it
                return new Progress<double>();
            }

            double percComplete = 0;
            IProgress<double> progress = new Progress<double>(percDone =>
            {
                percComplete += percDone;
                _progressHubContext.Clients.Client(connectionId).SendAsync("updateLoadingBar", percComplete);
            });

            return progress;
        }
    }
}
