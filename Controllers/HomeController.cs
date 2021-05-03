using Microsoft.AspNetCore.Mvc;
using SignalRDemo.Models;
using SignalRDemo.SignalR;
using System.Threading;
using System.Threading.Tasks;

namespace SignalRDemo.Controllers
{
    public class HomeController : Controller
    {
        private readonly IProgressReporterFactory _progressReporterFactory;

        public HomeController(IProgressReporterFactory progressReporterFactory)
        {
            _progressReporterFactory = progressReporterFactory;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Load(LoadViewModel loadViewModel, CancellationToken cancellationToken)
        {
            var progressReporter = _progressReporterFactory.GetLoadingBarReporter(loadViewModel.ConnectionId);

            for(int i = 0; i < loadViewModel.Seconds; i++)
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    return NoContent();
                }

                progressReporter.Report(1 / (double)loadViewModel.Seconds);
                await Task.Delay(1000);
            }

            return Content("Completed");

        }

    }
}
