window.fbAsyncInit = function () {

    FB.Event.subscribe('auth.statusChange', function (response) {
        $(document).trigger('fbStatusChange', response);
    });

    FB.init({
      appId      : '205873842914239', // App ID from the App Dashboard
      channelUrl : 'www.olliedevelopment.altervista.org/channel.html', // Channel File for x-domain communication
      status     : true, // check the login status upon init?
      cookie     : true, // set sessions cookies to allow your server to access the session?
      xfbml      : true  // parse XFBML tags on this page?
    });

};

// Load the SDK Asynchronously
(function (d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));