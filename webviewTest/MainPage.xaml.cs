using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using static System.Net.Mime.MediaTypeNames;

namespace webviewTest
{
    public partial class MainPage : ContentPage
    {
        string js_injection;

        public MainPage()
        {
            InitializeComponent();

            hybridWebView.RegisterAction(data => DoAction(data));

            hybridWebView.Navigated += HybridWebView_Navigated;


            //string fileName = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"js/nike");
            //string jsNike = File.ReadAllText("nike.js");

            var assembly = IntrospectionExtensions.GetTypeInfo(typeof(MainPage)).Assembly;
            Stream stream = assembly.GetManifestResourceStream("webviewTest.nike.js");
            string text = "";
            using (var reader = new System.IO.StreamReader(stream))
            {
                text = reader.ReadToEnd();
            }
            js_injection = text;

            //hybridWebView.Uri = "https://www.nike.com/";
            //hybridWebView.Uri = "https://google.com";
        }

        private void HybridWebView_Navigated(object sender, WebNavigatedEventArgs e)
        {
            if (e.Result == WebNavigationResult.Success)
            {
                hybridWebView.EvaluateJavaScriptAsync(js_injection);
                hybridWebView.EvaluateJavaScriptAsync($"CrowlFabric('air max 2021')");
            }
        }

        void DoAction(string data)
        {
            DisplayAlert("Alert", "Hello " + data, "OK");
            //DoEval();
        }

        void DoEval()
        {
            //hybridWebView must be called form main thread
            Device.BeginInvokeOnMainThread(async () =>
            {
                await hybridWebView.EvaluateJavaScriptAsync("log(12+33)");
            });
        }

    }
}
