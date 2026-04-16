(function () {
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mainNav = document.querySelector("[data-main-nav]");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 820) {
          mainNav.classList.remove("is-open");
          menuToggle.classList.remove("is-open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  var currentFile = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentFile) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  var localBgVideo = document.querySelector(".hero-video-local");
  var youtubeBgVideo = document.querySelector(".hero-video-youtube");

  if (localBgVideo && youtubeBgVideo) {
    var localVideoSrc = (localBgVideo.getAttribute("data-video-src") || "").trim();

    if (!localVideoSrc) {
      localBgVideo.style.display = "none";
    } else {
      localBgVideo.src = localVideoSrc;
      localBgVideo.load();

      var fallbackTimer = window.setTimeout(function () {
        if (localBgVideo.readyState < 2) {
          localBgVideo.style.display = "none";
          youtubeBgVideo.style.display = "block";
        }
      }, 1800);

      localBgVideo.addEventListener("loadeddata", function () {
        window.clearTimeout(fallbackTimer);
        youtubeBgVideo.style.display = "none";
      });

      localBgVideo.addEventListener("error", function () {
        localBgVideo.style.display = "none";
        youtubeBgVideo.style.display = "block";
      });
    }
  }

  var metricValues = document.querySelectorAll(".metric-value[data-target]");
  if (metricValues.length) {
    var hasAnimatedMetrics = false;

    var animateValue = function (element) {
      var target = Number(element.getAttribute("data-target") || 0);
      var suffix = element.getAttribute("data-suffix") || "";
      var duration = 1200;
      var startTime = null;

      var tick = function (timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.round(target * progress);
        element.textContent = String(value) + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      };

      window.requestAnimationFrame(tick);
    };

    var animateAllMetrics = function () {
      if (hasAnimatedMetrics) return;
      hasAnimatedMetrics = true;
      metricValues.forEach(animateValue);
    };

    if ("IntersectionObserver" in window) {
      var metricsSection = document.querySelector(".metrics");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateAllMetrics();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );

      if (metricsSection) {
        observer.observe(metricsSection);
      } else {
        animateAllMetrics();
      }
    } else {
      animateAllMetrics();
    }
  }

})();
