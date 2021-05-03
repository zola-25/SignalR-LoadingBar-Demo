

var loadingBar = (function () {

    $(document).ready(function () {

        $(document).on("click", "#btn-load", function (e) {

            $("#final-result").empty();

            let seconds = $("#Seconds").val();

            let dataModel = {
                seconds
            }

            let ajaxOptions = {
                type: "GET",
                data: dataModel,
                contentType: "application/json",
                traditional: true,
                url: "/Home/Load",
                success: function (result) {
                    $("#final-result").html(result);
                }
            };

            loadingWithProgressAndAbort.withSignalR(ajaxOptions);
        });
    });

})();


var loadingWithProgressAndAbort = (function () {

    function bindAbort(jqXHR) {

        $(document).on("click", "#loading-cancel", function () {
            jqXHR.abort();
            $("#final-result").html("Cancelled");
            enableLoadButton();
        });
    };

    function startLoading() {

        $("#div-loading").show();
    };

    function setProgress(progress) {

        $("#div-loading .progress-bar").attr("style", `width:${progress}%; transition:none;`);
        $("#div-loading .progress-bar").attr("aria-valuenow", progress);
        $("#div-loading .progress-bar").text(`${progress}% `);
    };

    function stopLoading() {

        $("#div-loading").hide();
        setProgress("#div-loading", 0);
    };

    function disableLoadButton() {

        let button = $("#btn-load");
        button.prop("disabled", true);
        button.addClass("disable-hover");
    };

    function enableLoadButton () {

        let button = $("#btn-load");
        button.prop("disabled", false);
        button.removeClass("disable-hover");

    };

    return {

        withSignalR: function (ajaxOptions) {

            disableLoadButton();

            var connection =
                new signalR.HubConnectionBuilder()
                    .withUrl("/loadingBarProgress")
                    .build();

            connection.on("updateLoadingBar",
                (perc) => {
                    var progress = Math.round(perc * 100);
                    setProgress(progress);
                });

            connection
                .start()
                .then(function () {

                    const connectionId = connection.connectionId;

                    if (ajaxOptions.data === undefined) {
                        ajaxOptions["data"] = {};
                    }
                    ajaxOptions.data["connectionId"] = connectionId;

                    const xhr = $.ajax(ajaxOptions);
                    bindAbort(xhr);
                    startLoading();

                    xhr.always(function () {
                        connection.stop();
                        stopLoading();
                        enableLoadButton();
                    });
                });
        }
    };

})();