
document.getElementById('text-trigger').onclick = function () {
  document.getElementById('crawl-result-textarea').style = ""
  document.getElementById('crawl-result-link').style = "display: none"
}

document.getElementById('link-trigger').onclick = function () {
  document.getElementById('crawl-result-textarea').style = "display: none"
  document.getElementById('crawl-result-link').style = ""
}

document.getElementById('crawl-trigger').onclick = function (element) {
   crawl()
}

function crawl () {
  var crawl_result_textarea = document.getElementById('crawl-result-textarea')
  var crawl_result_link = document.getElementById('crawl-result-link')
  var filter = document.getElementById('crawl-filter').value

  filter = filter.split(',');
  console.log(filter);
  //   console.log(elem)
  crawl_result_textarea.innerHTML = ''
  crawl_result_link.innerHTML = ''

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code:
          '	var result = [];' +
          '	var window_location = [];' +
          '	var crawl_url = [];' +
          '		' +
          '	window_location.push(window.location.href);' +
          '	window_location.push(window.location.protocol);' +
          '	window_location.push(window.location.hostname);' +
          '	window_location.push(window.location.pathname);' +
          '		' +
          ' 	document.getElementsByTagName("a");' +
          ' 	var elem = document.getElementsByTagName("a");' +
          ' 	for (i = 0; i < elem.length; i++) {' +
          '		if (elem[i].getAttribute("href") != null) {' +
          '			crawl_url.push(elem[i].getAttribute("href"));' +
          '		}' +
          '	}' +
          '	result.push(window_location);' +
          '	result.push(crawl_url);' +
          '	result;' +
          ''
      },
      function (result) {
        window_location = result[0][0]
        crawl_url = result[0][1]

        full_path = window_location[0]
        hostname = window_location[1] + '//' + window_location[2]

        console.log(window_location)
        console.log(crawl_url)

        for (i = 0; i < crawl_url.length; i++) {
          href = crawl_url[i]

          if (href.includes('javascript:void(0)')) {
            continue
          }

          if (!href.includes('http://') || !href.includes('https://')) {
            default_url = true
            if (href.charAt(0) === '#') {
              default_url = false
              href = full_path + href
            }

            if (href.charAt(0) === '/') {
              default_url = false
              href = hostname + href
            }

            if (default_url) {
              //   href = full_path + href
            }
          }

          if (filter !== '' && filter.some(r => href.includes(r))) {
            crawl_result_textarea.innerHTML += href + '&#13;&#10;'
            crawl_result_link.innerHTML += '<div><a href="'+href+'">'+href+'</a></div>'
          }

          if (filter === '') {
            crawl_result_textarea.innerHTML += href + '&#13;&#10;'
            crawl_result_link.innerHTML +=   '<div><a href="'+href+'">'+href+'</a></div>'
          }
        }
        console.log(crawl_url)
        console.log(crawl_url.length)
      }
    )
  })
}

// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.executeScript(
//           tabs[0].id,
//           {code: 'document.body.style.backgroundColor = "' + color + '";'});
//     });
//   };
