/**
 * rajax a javascript iframe form submit
 * with styled form input support
 *
 * v3.4.2
 *
 * Submit ajax like form along with file input
 * Any styled element can be used as File Input
 *
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * By Roni Kumar Saha (roni.cse@gmail.com)
 * Mobile: 01817087873
 * http://xiidea.github.io/rajax/
 *
 * Please use as you wish at your own risk.
 *
 */

(function () {
    //Some Private variable that should not accessible from outside
    var fileTypeExt = {
        "image": 'jpg|jpeg|gif|png|bmp|pct|psd|psp|thm|tif|ai|drw|dxf|eps|ps|svg|3dm|dwg|pln',
        "document": 'doc|pdf|docx|txt|log|msg|pages|rtf|wpd|wps|indd|qxd|qxp',
        "data": '123|accdb|csv|dat|db|dll|mdb|pps|ppt|pptx|sdb|sdf|sql|vcf|wks|xls|xlsx|xml',
        "archive": 'zip|rar|tar|tga|7z|deb|gz|pkg|sit|sitx|zipx|cab|gzip|uue|arj',
        "audio": 'wma|mp3|amr|wav|aif|iff|m3u|m4a|mid|mpa|ra',
        "video": 'mov|mpeg|mpg|3gp|3g2|vob|flv|swf|asx|asf|rm',
        "font": 'fnt|fon|otf|ttf',
        "script": 'php|html|js|htm|htmls|dhtml|php3|phps|php4|php5|asp|aspx|htaccess|vb|asr|htpasswd|asc|as|inc|config|cs|asa'
    };

    var getScriptBase = (function () {
        var scripts = document.getElementsByTagName('script');
        var index = scripts.length - 1;
        var myScript = scripts[index];
        return "/" + myScript.src.substring(0, myScript.src.lastIndexOf("/") + 1).split("/").slice(3).join("/");
    })();

    function getHostname(url) {
        var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
        var arr = url.match(re);
        return arr ? arr[1].toString() : document.location.hostname.toString();
    }

    function returnJSON(response) {
        if (response) {
            return eval("(" + response + ")");
        } else {
            return {};
        }
    }

    function getExtList(type) {
        if (type == '' || type == 'custom')
            return '';
        var extArr = type.split('|');
        var s = [];
        for (var i in extArr) {
            if(fileTypeExt.hasOwnProperty(extArr[i])){
                s[i] = fileTypeExt[extArr[i]];
            }
        }
        return s.join('|');
    }

    function isIn(value, param) {
        param = param.replace(/,/g, '|');
        return value.match(new RegExp(".(" + param + ")$", "i"));
    }

    function stopDefault(e) {
        if (e && e.preventDefault) e.preventDefault();
        else if (window.event && window.event.returnValue);
            window.event.returnValue = false;
    }

    /**
     * Attaches event to a dom element.
     * @param {Element} el
     * @param type event name
     * @param fn callback This refers to the passed element
     */
    function addEvent(el, type, fn) {
        if (el.addEventListener) {
            el.addEventListener(type, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, function () {
                fn.call(el);
            });
        } else {
            throw new Error('not supported or DOM not loaded');
        }
    }

    var getOffset = (function () {
        // Needs more testing, will be rewritten for next version
        // getOffset function copied from jQuery lib (http://jquery.com/)
        if (document.documentElement.getBoundingClientRect) {
            // Get Offset using getBoundingClientRect
            // http://ejohn.org/blog/getboundingclientrect-is-awesome/
            return function (el) {
                var box = el.getBoundingClientRect();
                var doc = el.ownerDocument;
                var body = doc.body;
                var docElem = doc.documentElement; // for ie
                var clientTop = docElem.clientTop || body.clientTop || 0;
                var clientLeft = docElem.clientLeft || body.clientLeft || 0;

                // In Internet Explorer 7 getBoundingClientRect property is treated as physical,
                // while others are logical. Make all logical, like in IE8.
                var zoom = 1;
                if (body.getBoundingClientRect) {
                    var bound = body.getBoundingClientRect();
                    zoom = (bound.right - bound.left) / body.clientWidth;
                }

                if (zoom > 1) {
                    clientTop = 0;
                    clientLeft = 0;
                }

                var top = box.top / zoom + (window.pageYOffset || docElem && docElem.scrollTop / zoom || body.scrollTop / zoom) - clientTop;
                var left = box.left / zoom + (window.pageXOffset || docElem && docElem.scrollLeft / zoom || body.scrollLeft / zoom) - clientLeft;
                return {
                    top: top,
                    left: left
                };
            };
        } else {
            // Get offset adding all offsets
            return function (el) {
                var top = 0, left = 0;
                do {
                    top += el.offsetTop || 0;
                    left += el.offsetLeft || 0;
                    el = el.offsetParent;
                } while (el);

                return {
                    left: left,
                    top: top
                };
            };
        }
    })();

    /**
     * Returns left, top, right and bottom properties describing the border-box,
     * in pixels, with the top-left relative to the body
     * @param {Element} el
     * @return {Object} Contains left, top, right,bottom
     */
    function getBox(el) {
        var left, right, top, bottom;
        var offset = getOffset(el);
        left = offset.left;
        top = offset.top;

        right = left + el.offsetWidth;
        bottom = top + el.offsetHeight;

        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom
        };
    }

    /**
     * Helper that takes object literal
     * and add all properties to element.style
     * @param {Element} el
     * @param {Object} styles
     */
    function addStyles(el, styles) {
        for (var name in styles) {
            if (styles.hasOwnProperty(name)) {
                el.style[name] = styles[name];
            }
        }
    }

    /**
     * Function places an absolutely positioned
     * element on top of the specified element
     * copying position and dimentions.
     * @param {Element} from
     * @param {Element} to
     */
    function copyLayout(from, to) {
        var box = getBox(from);

        addStyles(to, {
            position: 'absolute',
            left: box.left + 'px',
            top: box.top + 'px',
            width: from.offsetWidth + 'px',
            height: from.offsetHeight + 'px'
        });
    }

    /**
     * Creates and returns element from html chunk
     * Uses innerHTML to create an element
     */
    var toElement = (function () {
        var div = document.createElement('div');
        return function (html) {
            div.innerHTML = html;
            var el = div.firstChild;
            return div.removeChild(el);
        };
    })();

    /**
     * Function generates unique id
     * @return unique id
     */
    var getUID = (function () {
        var id = 0;
        return function () {
            return 'RAjaxPost' + id++;
        };
    })();


    /**
     * Get Element Reference
     * @param {element} The dom element reference (dom element/jquery element/element id)
     * @return {element object}
     */
    function GetElement(el) {
        if (el.jquery) {
            // jQuery object was passed
            el = el[0];
        } else if (typeof el == "string") {
            if (/^#.*/.test(el)) {
                // If jQuery user passes #elementId don't break it					
                el = el.slice(1);
            }

            el = document.getElementById(el);
        }
        return el || false;
    }


    /**
     * Get Parent Tag
     * @param {element} The dom element reference (dom element/jquery element/element id)
     * @param {String} Tag name to search like a/form/tr/div/span
     * @param {int} depth of search default 0
     * @return filename
     */
    function GetParentTag(element, tag, depth) {
        var el = GetElement(element);
        if (!el.parentNode)				//return null if parent node is not exist
            return null;
        if (typeof tag == 'undefined')		//return parent node if node type is not defined
            return el.parentNode;

        var c = depth || 0;
        if (el.parentNode.nodeName.toLowerCase() == tag.toLowerCase() && c == 0) {
            return el.parentNode;
        }
        else if (el.parentNode.nodeName.toLowerCase() == tag.toLowerCase()) {
            c--;
            return GetParentTag(el.parentNode, tag.toLowerCase(), c);
        }
        else {
            return GetParentTag(el.parentNode, tag.toLowerCase(), c);
        }
    }

    /**
     * Get file name from path
     * @param {String} file path to file
     * @return string filename
     */
    function fileFromPath(file) {
        return file.replace(/.*(\/|\\)/, "");
    }

    /**
     * Get file extension lowercase
     * @param {String} file name
     * @return string file extension
     */
    function getExt(file) {
        return (-1 !== file.indexOf('.')) ? file.replace(/.*[.]/, '') : '';
    }

    function hasClass(el, name) {
        var re = new RegExp('\\b' + name + '\\b');
        return re.test(el.className);
    }

    function addClass(el, name) {
        if (!hasClass(el, name)) {
            el.className += ' ' + name;
        }
    }

    function removeClass(el, name) {
        var re = new RegExp('\\b' + name + '\\b');
        el.className = el.className.replace(re, '');
    }


    function removeNode(el) {
        el.parentNode.removeChild(el);
    }


    /**
     * Easy styling and uploading
     * @constructor
     * @param button An element you want convert to
     * upload button. Tested dimensions up to 500x500px
     * @param {Object} options See defaults below.
     */
    window.SFileInput = function (name, options) {
        this._settings = {
            //Styled Button Reference
            button: '',

            //Target form if the input is out of any form element
            targetForm: false,

            //Denied file type(s)	[deny has more priority then acceptance]
            deniedType: 'script',
            //Allowed file type(s)
            allowedType: '',

            //Denied extension(s) used only if deniedType is 'custom'
            deniedExt: '',
            //Allowed extension(s) used only if allowedType is 'custom'
            allowedExt: '',

            // Class applied to button when mouse is hovered
            hoverClass: 'hover',
            // Class applied to button when button is focused
            focusClass: 'focus',
            // Class applied to button when AU is disabled
            disabledClass: 'disabled',

            //allow multiple file upload
            multipleFile: false,

            //Number of maximum allowed file count in case of multiple file allowed
            //0 for unlimited
            maximum: 0,

            //Set it true if the input field is a must field
            required: false,

            //Display Selected File Name, set false, if you like to handle your self
            showFileName:true,

            //Maximum lengths of file name will be shown without trimming
            // if the value is smaller then twice of file extension length it will
            //have no effect.
            fileNameMaxLength : 33,

            // Id Of selected file name
            //Useful when you like to display file name in your own element
            selectedFileLabel: '',

            // Class applied to selected file name  element
            selectedFileClass: 'selectedFileClass',

            // Class applied to selected file name  element
            multiInputRemoveClass: 'remove',

            //message to show on no selected file error
            nofileMsg: 'No file selected',

            //Message to show on file count exceeded maximumAllowed
            maximumAllowedExceededMsg: 'You are allowed to select {n} file(s) only',

            //Message show when selected extension is in denied list
            typeErrorDeniedExtensionMsg: '*.{s} file is not allowed',

            //Message show when selected file type is in denied list
            typeErrorDeniedTypeMsg: '{s} file(s) are not allowed',

            //Message show when selected file type is not in allowed list
            typeErrorFileTypeNotAllowedMsg: 'You are allowed to select {s} file(s) only',

            //Message show when selected extension is not in allowed list
            typeErrorExtensionNotAllowedMsg: 'only {s} file(s) are allowed',

            // When The file input reseted or the form reseted
            onClear: function (SFileInputObj) {
            },

            // When user selects a file, useful with Custom validation
            // You can return false to cancel upload			
            onChange: function (file, extension) {
            },

            //When user select any denied File
            //You can process file name and extension to view custom message.
            //Return True to override native alert message
            onDenied: function (file, extension) {
            },

            //When user select any acceptable File
            //You can process with file name and extension
            //Return false to cancel selection
            // Most of the time the function is not needed
            onAccept: function (file, extension) {

            },

            //When selected file count exceed the maximum allowed
            //file. You will have the opportunity to handle here
            // Most of the time the function is not needed
            onMaximumAllowedExceeded: function (input, maximumAllowed) {
                return 'default';
            },

            //It will helpful to show error message as per user wish
            showMessage: null

        };

        // Merge the users options with our defaults
        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                this._settings[i] = options[i];
            }
        }

        if (this._settings.multipleFile == true) {
            this._settings.name = name + "[]";
            //this._multiInput=new Array();
        } else {
            this._settings.name = name;
        }


        var button = GetElement(this._settings['button']);

        if (!button || button.nodeType !== 1) {
            throw new Error("Please make sure that you're passing a valid element");
        }

        //denied type not changed but extension provided, so set the type to custom
        if (this._settings.deniedExt != '' && this._settings.deniedType == 'script') {
            this._settings.deniedType = 'custom';
        }
        //allowed type not given but allowed extension given, set the type to custom
        if (this._settings.allowedExt != '' && this._settings.allowedType == '') {
            this._settings.allowedType = 'custom';
        }


        if (button.nodeName.toUpperCase() == 'A') {
            // disable link                       
            addEvent(button, 'click', stopDefault);
        }
        //Default no file selected
        this.fileselected = 0;
        this.inputCreated = 0;

        // DOM element
        this._button = button;
        // DOM element                 
        this._input = null;
        // If disabled clicking on button won't do anything
        this._disabled = false;

        this._parentForm = GetParentTag(this._button, 'form');

        var form = this._settings.targetForm || this._parentForm

        //To do, if form is not found then create a form element to handle the submit process
        if (!form) {	//for now If form not found throw error
            throw new Error('The input is without a form element');
        }

        var self = this;

        addEvent(form, 'reset', function () {
            self._clearInput();
        });

        this._form = form;

        // if the button was disabled before refresh if will remain
        // disabled in FireFox, let's fix it
        this.enable();

        this._rerouteClicks();
    };

    // assigning methods to our class
    SFileInput.prototype = {
        disable: function () {
            addClass(this._button, this._settings.disabledClass);
            this._disabled = true;

            var nodeName = this._button.nodeName.toUpperCase();
            if (nodeName == 'INPUT' || nodeName == 'BUTTON') {
                this._button.setAttribute('disabled', 'disabled');
            }

            // hide input
            if (this._input) {
                if (this._input.parentNode) {
                    // We use visibility instead of display to fix problem with Safari 4
                    // The problem is that the value of input doesn't change if it 
                    // has display none when user selects a file
                    this._input.parentNode.style.visibility = 'hidden';
                }
            }
        },
        enable: function () {
            removeClass(this._button, this._settings.disabledClass);
            this._button.removeAttribute('disabled');
            this._disabled = false;

        },
        reset: function () {
            this._clearInput();
        },
        _showMessage: function (msg) {
            var self = this
            if (self._settings.showMessage) {
                self._settings.showMessage.call(self, msg)
            } else {
                alert(msg);
            }
        },


        /**
         * Create Label For file name
         * that will created after form element
         */
        _createLabel: function () {
            var self = this;
            var label = document.createElement("label");
            label.setAttribute('id', 'sfinput-label-id-for-'+self._input.name);
            self._button.parentNode.insertBefore(label, self._button.nextSibling);
            return label;
        },

        /**
         * Create Label For multiple file input
         * that will created after form element
         */
        _createMultipleLabel: function () {
            var self = this, ol;
            if (self._label.childNodes.length > 0) {
                ol = self._label.childNodes.item(0);
            } else {
                ol = document.createElement("ol");
                self._label.appendChild(ol);
            }
            //now create the list item
            var li = document.createElement("li");
            li.setAttribute('id', 'sf-input-label-mid-for-' + self.inputCreated + self._input.name)
            ol.appendChild(li);
            return li;
        },


        /**
         * Creates invisible file input
         * that will hover above the button
         * <div><input type='file' /></div>
         */
        _createInput: function () {
            var self = this;

            var input = document.createElement("input");
            input.setAttribute('type', 'file');
            input.setAttribute('name', this._settings.name);

            addStyles(input, {
                'position': 'absolute',
                // in Opera only 'browse' button
                // is clickable and it is located at
                // the right side of the input
                'right': 0,
                'margin': 0,
                'padding': 0,
                'fontSize': '480px',
                // in Firefox if font-family is set to
                // 'inherit' the input doesn't work
                'fontFamily': 'sans-serif',
                'cursor': 'pointer'
            });

            var div = document.createElement("div");
            addStyles(div, {
                'display': 'block',
                'position': 'absolute',
                'overflow': 'hidden',
                'margin': 0,
                'padding': 0,
                'opacity': 0,
                // Make sure browse button is in the right side
                // in Internet Explorer
                'direction': 'ltr',
                //Max zIndex supported by Opera 9.0-9.2
                'zIndex': 2147483583
            });

            // Make sure that element opacity exists.
            // Otherwise use IE filter            
            if (div.style.opacity !== "0") {
                if (typeof(div.filters) == 'undefined') {
                    throw new Error('Opacity not supported by the browser');
                }
                div.style.filter = "alpha(opacity=0)";
            }

            addEvent(input, 'change', function () {

                if (!input || input.value === '') {
                    return;
                }

                var selected = input.files.length || 1

                // Get filename from input, required
                // as some browsers have path instead of it

                var file = fileFromPath(input.value);
                var ext = getExt(file);

                if (self._settings.maximum > 0 && (self.fileselected + selected) > self._settings.maximum) {
                    if('default' === self._settings.onMaximumAllowedExceeded.call(self, self, self._settings.maximum)){
                        self._showMessage(self._settings.maximumAllowedExceededMsg.replace('{n}', self._settings.maximum.toString()))
                    }

                    return;
                }

                //Check if the file type is allowed or not
                var deniedExt = (self._settings.deniedType == 'custom') ? self._settings.deniedExt : getExtList(self._settings.deniedType);
                var allowedExt = (self._settings.allowedType == 'custom') ? self._settings.allowedExt : getExtList(self._settings.allowedType);
                //alert(self._settings.deniedType)
                var isValid = self._validateType(file, deniedExt, allowedExt);

                if (isValid !== true) {
                    if (true !== self._settings.onDenied.call(self, file, ext)) {
                        var alert_str = "";
                        if (isValid === 'denied') {	//Restricted file selected
                            if(self._settings.deniedType == 'custom'){
                                alert_str = self._settings.typeErrorDeniedExtensionMsg.replace('{s}', ext);
                            }else{
                                var deniedTypes = self._settings.deniedType.split("|").join(",").replace(/,([^,]+)$/, ' & $1');
                                alert_str = self._settings.typeErrorDeniedTypeMsg.replace('{s}', deniedTypes);
                            }
                        } else {
                            if (self._settings.allowedType == 'custom') {
                                var allowedExtension = "(*." + allowedExt.split("|").join(", *.") + ")";
                                alert_str = self._settings.typeErrorExtensionNotAllowedMsg.replace('{s}', allowedExtension);
                            } else {
                                var allowedTypes = self._settings.allowedType.split("|").join(",").replace(/,([^,]+)$/, ' & $1');
                                alert_str = self._settings.typeErrorFileTypeNotAllowedMsg.replace('{s}', allowedTypes);
                            }
                        }
                        self._showMessage(alert_str);
                    }
                    return;
                }

                if (false === self._settings.onAccept.call(self, file, ext)) {
                    return;
                }

                if (false === self._settings.onChange.call(self, file, ext)) {
                    return;
                }


                //  if (self._settings.showFileName) {
                if (!self._label) {
                    var label = GetElement(self._settings.selectedFileLabel);
                    if (!label) {
                        label = self._createLabel()
                    }

                    if (self._settings.selectedFileClass != "") {
                        addClass(label, self._settings.selectedFileClass);
                    } else {
                        addStyles(label, {
                            'marginLeft': '10px'
                        });
                    }
                    self._label = label;
                }

                if (!self._settings.showFileName) {
                    addStyles(self._label, {'display': 'none'});
                }

                var inputMoveTo;
                removeClass(self._button, self._settings.hoverClass);
                if (self._settings.multipleFile == true) {	//Need to create new input entry
                    var multiInput = self._createMultipleLabel();
                    multiInput.innerHTML = self._formatFileName(file);
                    inputMoveTo = multiInput;
                } else {
                    self._label.innerHTML = self._formatFileName(file);
                    inputMoveTo = self._label;
                }

                if (self._form.generated) {
                    var dummyDiv = GetElement('dummy-' + inputMoveTo.id);
                    if (dummyDiv) {
                        removeNode(dummyDiv);
                    }
                    self._moveInput(self._form, inputMoveTo);
                } else {
                    self._moveInput(inputMoveTo, inputMoveTo);
                }
                //   }

            });

            addEvent(input, 'mouseover', function () {
                addClass(self._button, self._settings.hoverClass);
            });

            addEvent(input, 'mouseout', function () {
                removeClass(self._button, self._settings.hoverClass);
                removeClass(self._button, self._settings.focusClass);

                if (input.parentNode) {
                    // We use visibility instead of display to fix problem with Safari 4
                    // The problem is that the value of input doesn't change if it 
                    // has display none when user selects a file
                    input.parentNode.style.visibility = 'hidden';
                }
            });

            addEvent(input, 'focus', function () {
                addClass(self._button, self._settings.focusClass);
            });

            addEvent(input, 'blur', function () {
                removeClass(self._button, self._settings.focusClass);
            });


            div.appendChild(input);

            //form.appendChild(div);
            //The positioning problem arise in form mode, Better insert it into form while submitting
            document.body.appendChild(div);

            this._input = input;
        },

        _moveInput: function (element, wrapper_el) {
            var el = GetElement(element);
            var self = this;
            if (self._input) {
                //alert("everything ok "+self._input.id)
                self._input.onChange = "";
                self._input.parentNode.onMouseover = "";
                addStyles(self._input.parentNode, {
                    "visibility": 'hidden',
                    'width': "0px",
                    'height': "0px",
                    "left": 0,
                    "top": 0
                });
                var tempinput = self._input.parentNode;

                tempinput.setAttribute('id', 'dummy-'+wrapper_el.id)
                // assuming following structure
                // div -> input type='file'
                removeNode(self._input.parentNode);
                if (self._settings.multipleFile) {
                    self._createRemoveButton(wrapper_el, tempinput);
                }

                el.appendChild(tempinput);
                //alert(el.nodeName)
                self.fileselected++;
                self.inputCreated++;
                self._input = null;
                self._createInput();
            } else {
                throw new Error('something gone wrong!!');
            }

        },

        _createRemoveButton: function (el, temp) {
            var self = this;
            var remove = document.createElement("a");
            addClass(remove, self._settings.multiInputRemoveClass);
            remove.innerHTML = "<span>x</span>";

            addEvent(remove, 'click', function () {
                self.fileselected = self.fileselected - 1;
                removeNode(temp);
                removeNode(this.parentNode);
            });

            el.appendChild(remove);
        },

        _clearInput: function () {
            var self = this;
            if (!self._input) {
                return;
            }
            self.fileselected = 0;
            self.inputCreated = 0;
            self._settings.onClear.call(self, self)
            // this._input.value = ''; Doesn't work in IE6

            if (self._label) {
                self._label.innerHTML = "";
                var dummyContainer = GetElement('dummy-' + this._label.id);
                dummyContainer && removeNode(dummyContainer);
            }

            removeNode(this._input.parentNode);
            this._input = null;
            this._createInput();

            removeClass(this._button, this._settings.hoverClass);
            removeClass(this._button, this._settings.focusClass);
        },

        validate: function () {
            var self = this;
            if (!self._validate()) {
                self._showMessage(self._settings.nofileMsg);
                return false;
            }
            return true;
        },

        _validate: function () {
            var self = this;
            if (self._settings.required) {	//Special checking required
                return (self.fileselected && self.fileselected > 0)
            }
            return true;
        },

        /**
         * Function to check if file type is acceptable or not
         */
        _validateType: function (file, deniedExt, allowedExt) {
            //First check for denied

            if (deniedExt != "") {
                if (isIn(file, deniedExt)) {	//Nothing to go for it is / hand over control to user
                    return 'denied';
                }
            } else if (allowedExt == "") {		//No filter used allow everything
                return true;
            }

            //We come here that means we are not denied.
            //alert(allowedExt)
            if (allowedExt != "") {
                return (false || isIn(file, allowedExt)) && true;
            }
            return true;
        },


        /**
         * Function makes sure that when user clicks upload button,
         * the this._input is clicked instead
         */
        _rerouteClicks: function () {
            var self = this;

            // IE will later display 'access denied' error
            // if you use using self._input.click()
            // other browsers just ignore click()

            addEvent(self._button, 'mouseover', function () {
                if (self._disabled) {
                    return;
                }

                if (!self._input) {
                    self._createInput();
                }

                var div = self._input.parentNode;
                copyLayout(self._button, div);
                div.style.visibility = 'visible';
            });
        },

        _formatFileName: function (name) {
            var trimOption = this._getTrimmingOptions(name);

            if (trimOption) {
                name = name.slice(0, trimOption.first) + '...' + name.slice(-1 * trimOption.last);
            }
            return name;
        },
        _getTrimmingOptions: function (name) {
            if (this._settings.fileNameMaxLength >= name.length) {
                return false;
            }

            var ext = getExt(name)
            if (ext.length * 2 >= this._settings.fileNameMaxLength - 4) {
                return false;
            }
            var trimOption = {};
            trimOption.last = (ext.length * 2 ) + 1;
            trimOption.first = this._settings.fileNameMaxLength - trimOption.last - 3

            return trimOption;
        }

    };


    window.Rajax = window.rajax = function (form, options) {
        this._settings = {
            //Set to true for debugging server side out put. The
            //request will be submitted in blank target
            debug: false,

            //The local empty resource url
            localResource: getScriptBase + "blank.html",

            // Location of the server-side script
            action: null,

            // Additional data to send as {name:value} pair
            data: {},

            // The type of data that you're expecting back from the server.
            // html and xml are detected automatically.
            // Only useful when you are using json data as a response.
            // Set to "json" in that case. 
            responseType: false,

            //unify the request with random integer when set to false
            noCache: true,
            //STYLED BUTTON REFERENCE Will Be used as file input
            finputs: {},

            //Auto submitting form means submit trigger uppon form submit
            //Default disable, make it safe to work with other library
            autoSubmit: false,

            // Callback to fire before form is submitted
            // You can return false to cancel submit
            onSubmit: function () {
            },

            // Callback to fire before form is ready for submission
            // You can return false to cancel submit
            onBeforeSubmit: function () {
            },

            //Callback to fire after form is submitted
            //You can display messages or perform task after form submitted
            onAfterSubmit: function () {

            },

            // Fired when file upload is completed
            // WARNING! DO NOT USE "FALSE" STRING AS A RESPONSE!
            onComplete: function (response) {
            }
        };


        // Merge the users options with our defaults
        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                this._settings[i] = options[i];
            }
        }

        //These two variables are critical to the success of this operation
        this.xdm_formSubmitted = false;
        this.sameDomainRestored = false;


        // form isn't necessary a dom element
        if (form != "") {
            var form = GetElement(form);
            if (!form || form.nodeType !== 1) {
                throw new Error("Please make sure that you're passing a valid element");
            }

            if (form.nodeName.toUpperCase() != 'FORM') {
                throw new Error("Please make sure that you're passing a valid form element");
            }
        } else {
            form = this._createForm();
            form.generated = true;

        }

        //CREATE ALL STYLED INPUT
        this.sfinputs = new Array();
        for (var i in this._settings['finputs']) {
            if(form.generated) this._settings['finputs'][i]['targetForm'] = form;
            this.sfinputs[i] = new SFileInput(i, this._settings['finputs'][i]);
        }

        // DOM element
        this._form = form;

        //Set the server script from form action if one is not provided
        if (this._settings.action == null) {
            this._settings.action
        }

        if (this._settings.autoSubmit && form != "") {
            var self = this;
            addEvent(self._form, 'submit', function () {
                self.post();
            });
        }
    };


    rajax.prototype = {
        setData: function (data) {
            this._settings.data = data;
        },

        /**
         * Creates iframe with unique name
         * @return {Element} iframe
         */
        _createIframe: function () {
            // We can't use getTime, because it sometimes return
            // same value in safari :(
            var id = getUID();

            // We can't use following code as the name attribute
            // won't be properly registered in IE6, and new window
            // on form submit will open
            // var iframe = document.createElement('iframe');
            // iframe.setAttribute('name', id);                        

            var iframe = toElement('<iframe src="javascript:false;" name="' + id + '" />');
            // src="javascript:false; was added
            // because it possibly removes ie6 prompt 
            // "This page contains both secure and nonsecure items"
            // Anyway, it doesn't do any harm.            
            iframe.setAttribute('id', id);

            iframe.style.display = 'none';

            if (!this._settings.debug) {
                document.body.appendChild(iframe);
            }

            return iframe;
        },

        /**
         * Creates form, that will be submitted to iframe
         */
        _createForm: function () {
            // We can't use the following code in IE6
            // var form = document.createElement('form');
            // form.setAttribute('method', 'post');
            // form.setAttribute('enctype', 'multipart/form-data');
            // Because in this case file won't be attached to request
            var form = toElement('<form method="post" enctype="multipart/form-data"></form>');
            form.style.display = 'none';
            document.body.appendChild(form);
            return form;
        },
        /**
         * Config form elements, that will be submitted to iframe
         * @param {Element} iframe Where to submit
         * @return {Element} form
         */
        _configForm: function (iframe, form) {
            var settings = this._settings;

            form.setAttribute('action', settings.action);
            if (settings.debug) {
                form.setAttribute('target', '_blank');
            } else {
                form.setAttribute('target', iframe.name);
            }
            form.method = "POST";
            form.setAttribute("enctype", "multipart/form-data");
            form.setAttribute("encoding", "multipart/form-data");


            // Create hidden input element for each data key
            // And put it in hidden div
            if (document.getElementById('rajax_input_holder' + iframe.name)) {	//If div already exist use it
                var div = document.getElementById('rajax_input_holder' + iframe.name);
                div.innerHTML = "";	//Remove earlier assigned values
            } else {				//Else create it
                var div = document.createElement("div");
                addStyles(div, {
                    'display': 'none',
                    'position': 'absolute'
                });
                div.setAttribute("id", 'rajax_input_holder' + iframe.name);
                form.appendChild(div);
            }

            for (var prop in settings.data) {
                if (settings.data.hasOwnProperty(prop)) {
                    var el = document.createElement("input");
                    el.setAttribute('type', 'hidden');
                    el.setAttribute('name', prop);
                    el.setAttribute('value', settings.data[prop]);
                    div.appendChild(el);
                }
            }

            return form;
        },

        clear: function(){
            this._form.reset();
        },

        /**
         * Gets response from iframe and fires onComplete event when ready
         * @param iframe
         * @param file Filename to use in onComplete callback
         */
        _getResponse: function (iframe) {
            // getting response
            var toDeleteFlag = false, self = this;

            addEvent(iframe, 'load', function () {

                var settings = self._settings;

                if (// For Safari 
                    iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" ||
                        // For FF, IE
                        iframe.src == "javascript:'<html></html>';") {
                    // First time around, do not delete.
                    // We reload to blank page, so that reloading main page
                    // does not re-submit the post.

                    if (toDeleteFlag) {
                        // Fix busy state in FF3
                        setTimeout(function () {
                            removeNode(iframe);
                        }, 0);
                    }

                    return;
                }

                var response;

                //If this is the initial response from the POST, we are still in the POST server's domain
                if (self.xdm_formSubmitted && !self.sameDomainRestored) {
                    //Now you know we're about to restore the local domain right?
                    self.sameDomainRestored = true;
                    //localResourceUrl is passed by the calling page and points to a local empty page
                    iframe.contentWindow.location = settings.localResource;
                    return false;
                }
                //If the form was submitted and we have loaded data from our own domain, we are good. Thank you for coming
                //and here is your data! It's gonna be 5 dollars, Thank you!
                else if (self.xdm_formSubmitted && self.sameDomainRestored) {
                    response = iframe.contentWindow.name;
                    self.sameDomainRestored = false;
                    self.xdm_formSubmitted = false;

                    if (!response) {
                        response = "";
                    }

                    if (settings.responseType && settings.responseType.toLowerCase() == 'json') {
                        response = returnJSON(response);
                    }
                    settings.onComplete.call(self, response, self);


                    // Reload blank page, so that reloading main page
                    // does not re-submit the post. Also, remember to
                    // delete the frame
                    toDeleteFlag = true;

                    // Fix IE mixed content issue
                    iframe.src = "javascript:'<html></html>';";
                    return;
                }

                var doc = iframe.contentDocument ? iframe.contentDocument : window.frames[iframe.id].document;

                // fixing Opera 9.26,10.00
                if (doc.readyState && doc.readyState != 'complete') {
                    // Opera fires load event multiple times
                    // Even when the DOM is not ready yet
                    // this fix should not affect other browsers
                    return;
                }

                // fixing Opera 9.64
                if (doc.body && doc.body.innerHTML == "false") {
                    // In Opera 9.64 event was fired second time
                    // when body.innerHTML changed from false 
                    // to server response approx. after 1 sec
                    return;
                }

                if (doc.XMLDocument) {
                    // response is a xml document Internet Explorer property
                    response = doc.XMLDocument;
                } else if (doc.body) {
                    // response is html document or plain text
                    response = doc.body.innerHTML;

                    if (settings.responseType && settings.responseType.toLowerCase() == 'json') {
                        // If the document was sent as 'application/javascript' or
                        // 'text/javascript', then the browser wraps the text in a <pre>
                        // tag and performs html encoding on the contents.  In this case,
                        // we need to pull the original text content from the text node's
                        // nodeValue property to retrieve the unmangled content.
                        // Note that IE6 only understands text/html
                        if (doc.body.firstChild && doc.body.firstChild.nodeName.toUpperCase() == 'PRE') {
                            doc.normalize();
                            response = doc.body.firstChild.firstChild.nodeValue;
                        }
                        response = returnJSON(response)
                    }
                } else {
                    // response is a xml document
                    response = doc;
                }

                settings.onComplete.call(self, response, self);

                // Reload blank page, so that reloading main page
                // does not re-submit the post. Also, remember to
                // delete the frame
                toDeleteFlag = true;

                // Fix IE mixed content issue
                iframe.src = "javascript:'<html></html>';";
            });
        },

        /**
         * submit form
         */
        post: function () {

            var self = this, settings = this._settings;

            if (!this._form) {
                return false;
            }

            // sending request    

            var iframe = this._createIframe();

            // user returned false to cancel submit
            if (false === settings.onBeforeSubmit.call(this, this)) {
                return false;
            }

            var form = this._configForm(iframe, this._form);

            for (var i in this.sfinputs) {
                //Also validate ie check if it is a must field or not
                if (!this.sfinputs[i]._validate()) {
                    this.sfinputs[i]._showMessage(this.sfinputs[i]._settings.nofileMsg);
                    return false;
                }
            }

            // user returned false to cancel submit
            if (false === settings.onSubmit.call(this, this, this._form)) {
                return false;
            }

            if (settings.noCache) {
                //Unify the request
                form.action += (form.action.indexOf("?") != -1) ? "&" + new Date().getTime() : "?" + new Date().getTime();
            }

            if (getHostname(settings.action) != document.location.hostname.toString()) {	//Cross Domain submitted
                this.xdm_formSubmitted = true;
            }

            form.submit();

            settings.onAfterSubmit.call(this, this, form);

            removeNode(document.getElementById('rajax_input_holder' + iframe.name));

            if (settings.debug) {
                iframe = null;
                return;
            }

            // Get response from iframe and fire onComplete event when ready
            this._getResponse(iframe);
            return false;
        }
    };
})();