var Imgur = (function (d) {
    "use strict";
    /*jslint browser: true*/
    var module = {
        xhr: function () {
            return new XMLHttpRequest();
        },
        create: function (name, props) {
            var el = d.createElement(name), p;
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    el[p] = props[p];
                }
            }
            return el;
        },
        remove: function (els) {
            while (els.hasChildNodes()) {
                els.removeChild(els.lastChild);
            }
        },
        bindEvent: function () {
            var fileinput = d.querySelector('#uploadBtn'),
                fileName  = d.querySelector('#uploadFile'),
                status    = d.querySelector('.status'),
                self      = this;

            fileinput.addEventListener('change', function (e) {
                var files = e.target.files, file, p, t, i, len;
                for (i = 0, len = files.length; i < len; i += 1) {
                    file = files[i];
                    if (file.type.match(/image.*/)) {
                        self.remove(status);
                        fileName.value = this.value;

                        p = self.create('p');
                        t = d.createTextNode("Uploading...");

                        p.appendChild(t);
                        status.appendChild(p);

                        self.upload(file);
                    } else {
                        self.remove(status);

                        p = self.create('p');
                        t = d.createTextNode("Invalid Archive");

                        p.appendChild(t);
                        status.appendChild(p);
                    }
                }
            }, false);
        },
        upload_main: function(link){
            //var xhttp    = module.xhr(),
            //    status   = d.querySelector('.status'),
            //    self     = this,
            //    fd       = new FormData();
            //alert(link);
            //fd.append(link);
            //xhttp.open('POST', 'https://tinogram.firebaseio.com/tests.json');
            //xhttp.onreadystatechange = function () {
            //};
            //xhttp.send(fd);
            var myFirebaseRef = new Firebase("https://tinogram.firebaseio.com/tests");
            myFirebaseRef.push({
                url: link
            });
            return "success"
        },
        upload: function (file) {
            var xhttp    = module.xhr(),
                status   = d.querySelector('.status'),
                self     = this,
                fd       = new FormData();

            fd.append('image', file);
            xhttp.open('POST', 'https://api.imgur.com/3/image');
            xhttp.setRequestHeader('Authorization', 'Client-ID dcc27958369bd31'); //Get yout Client ID here: http://api.imgur.com/
            xhttp.onreadystatechange = function () {
                if (xhttp.status === 200 && xhttp.readyState === 4) {
                    var res = JSON.parse(xhttp.responseText), link, p, t;

                    self.remove(status);

                    link = res.data.link;
                    alert(link);
                    p    = self.create('p');
                    t    = d.createTextNode(self.upload_main(link));
                    p.appendChild(t);
                    status.appendChild(p);
                }
            };
            xhttp.send(fd);

        },
        init: function () {
            module.bindEvent();
        }
    };

    return {
        init: module.init
    };
}(document));