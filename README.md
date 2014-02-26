Rajax
=====
A javascript library to handle ajax like form submit. Please use as you wish at your own risk.


Key Features
============
* Easy to integrate with any form
* Supports Styled File Input
* Any styled Html element can be used as File Input
* Styled File Input Can be used within any form
* Supports File Input type validation
* Ajax like form submit with custom data
* No data size limitation
* Cross domain communication using name transport
 

Current Active Version
======================
v 3.4.2

 
USES and Cookbook
=================
* **Basic Uses, Submit your form and do something after the request completed**
```javascript
    var rajax_obj = new Rajax('my-form-id',
    {
        autoSubmit:true,
        onComplete:function(response) {
                //Complete Actions
        }
    });
```

* **Basic use Styled File Input Only**
```javascript
        var sInput = new SFileInput('input_name', {
    			button:'element_id',    //The element ID you want to use as file input
    	});
 ```

* **Use Rajax with styled file input**

```javascript
    var rajax_obj=new Rajax(form,
     {
         finputs: {                             //All Styled file input options, user input_name as key
            input_name_1: {                     //input_name_1 will be the name of your input field
                button:'file_uploader_element1'
            },
            input_name_2: {
                button:'file_uploader_element2'
            }
          },
         autoSubmit:true,
         onComplete:function(response) {
                 //Complete Actions
         }
     });
 ```

* **Use with other libraries which bind to the form submit event**
```javascript
    var rajax_obj = new Rajax('my-form-id',
    {
        //autoSubmit : false,       //Default value is false, you can omit this option
        onComplete : function(response) {
                //Complete Actions
        }
    });

    rajax_obj.post();   //Trigger submitting the form manually
```

* **Use without a form!**
```javascript
    var rajax_obj = new Rajax('',
    {
        onComplete : function(response) {
                //Complete Actions
        }
    });

    rajax_obj.post();   //Trigger submitting the form manually
```

* **Cross domain Implementation**

Cross domain communication need some extra scripting and its till experimental. only checked on FF10, IE9, Chrome17. Hope fully it should work on other version of browser. To perform cross browser submission you need to follow the steps bellow:

* Place **blank.html** file in your working directory or any other location and assign as **localResource** value.
                                                                                                       
```javascript
    var rajax_obj=new rajax(form,
      {
    	  localResource:"path/to/local/blank.html"
      });
 ```

* Remote Server Scripting: You need to add a javascript code on the page of remote domain

To pass Your Message
```html
    <script>
    	window.name="Your Message Here";
    </script>
 ```

or To pass Full Body Content
 ```html
    <html>
        <body>
            Your Message Here
        </body>
        <script>
            window.name=document.getElementsByTagName('body')[0].innerHTML;
        </script>
    <html>
 ```

Rajax Options:
--------------
* **action**  
type: string  
default : null  
Location of the server-side script. omit it if you like to use the form action attribute instead

* **data**  
Type: PlainObject  
Additional data to be sent to the server as {name:value} pair

* **responseType**  
type: string  
The type of data that you're expecting back from the server. html and xml are detected automatically. Only useful when you are using json data as a response. Set to "json" in that case.

* **noCache**  
type: boolean  
default : true  
unify the request with random integer when set to false. Useful when you are submitting nothing and accessing a url.

* **finputs**  
type: Object  
default : {}  
STYLED BUTTON REFERENCE Will Be used as file input. This section contain all Styled Input Button settings

* **autoSubmit**  
type: boolean  
default : false  
Auto submitting form means submit trigger upon form submit event. Default disable, make it safe to work with other library

* **onBeforeSubmit**  
Type: Function( Rajax rajaxObject)  
A function to be called when the request being prepared, before styled input validation done. The function gets passed one arguments: The rajaxObject object. You can use <code>rajaxObject.setData({'username':'roni','password':'123456'});</code> api to set custom data. You can return false to cancel submit

* **onSubmit**  
Type: Function( Rajax rajaxObject, Object form )  
A function to be called when the request ready to post, styled input validation done(after onBeforeSubmit callback are executed) just before submitting. The function gets passed two arguments: The rajaxObject object and the form object. You can return false to cancel submit

* **onAfterSubmit**  
Type: Function( Rajax rajaxObject, Object form )  
A function to be called just after submitting. The function gets passed two arguments: The rajaxObject object and the form object. For some Request We may not expect receive response from server. on those cases, we can use this callback to complete our action as the onComplete event may not fired

* **onComplete**  
Type: Function( mix response, Rajax rajaxObject )  
A function to be called when the request finishes (after all other callbacks are executed). The function gets passed two arguments: The response from server and The rajaxObject object.


SFileInput Options:
===================
* **button**  
type: string  
required : true  
Styled Button Reference. Id of the html element we like to use as file input

* **deniedType**  
Type: string  
Pipe line separated Denied file type(s) like <code>'image|document|audio'</code>	[deny has more priority then acceptance]

* **allowedType**  
Type: string  
Pipe line separated Allowed file type(s) like <code>'image|document|audio'</code>

* **deniedExt**  
Type: string  
Pipe line separated Denied file extension(s) like <code>'doc|docx|gif'</code> Denied extension(s) used only if deniedType is 'custom'

* **allowedExt**  
Type: string  
Pipe line separated Allowed file extension(s) like <code>'doc|docx|gif'</code> Denied extension(s) used only if allowedType is 'custom'

* **hoverClass**  
type: string  
Class applied to button when mouse is hovered

* **focusClass**  
type: string  
Class applied to button when button is focused

* **disabledClass**  
type: string  
Class applied to button when  when button is disabled

* **multipleFile**  
type: boolean  
default : false  
control allowing multiple file upload

* **maximum**  
type: integer  
default : 0 [unlimited]  
Number of maximum allowed file count in case of multiple file allowed

* **required**  
type: boolean  
default : false  
Set it true if the input field is a required field

* **showFileName**  
type: boolean  
default : true  
Display Selected File Name, set false, if you like to handle your self

* **fileNameMaxLength**  
type: integer  
Maximum lengths of file name will be shown without trimming. if the value is smaller then twice of file extension length it will have no effect.

* **selectedFileLabel**  
type: string  
Id Of element you like to show the selected file name. Useful when you like to display file name in your own pre-existing element

* **selectedFileClass**  
type: string  
Class applied to selectedFileLabel  element

* **multiInputRemoveClass**  
type: string  
Class applied to selected file name  element

* **nofileMsg**  
type: string  
message to show on no selected file error

* **maximumAllowedExceededMsg**  
type: string  
Message to show on file count exceeded maximumAllowed. You can use {n} place holder to display maximum allowed number

* **typeErrorDeniedExtensionMsg**   
type: string   
default: \*.{s} file is not allowed   
Message to show on selecting a denied file extension. You can use {s} place holder to display extension

* **typeErrorDeniedTypeMsg**   
type: string   
default: {s} file(s) are not allowed   
Message to show on selecting a denied file type. You can use {s} place holder to display types

* **typeErrorFileTypeNotAllowedMsg**   
type: string   
default: You are allowed to select {s} file(s) only   
Message to show on selecting a file type that is not in allowed list. You can use {s} place holder to display types those are allowed

* **typeErrorExtensionNotAllowedMsg**   
type: string   
default: only {s} file(s) are allowed   
Message to show on selecting a file with extension that is not in allowed list. You can use {s} place holder to display extensions those are allowed

* **onClear**   
Type: Function( SFileInput file)  
A function to be called when the file input reseted or the form reseted. The function gets passed one arguments: The SFileInput object.

* **onChange**  
Type: Function( String file, String extension )  
A function to be called When user selects a file. useful with Custom validation. You can return false to cancel file selection. The function gets passed two arguments: The file name and the file extension.

* **onDenied**  
Type: Function( String file, String extension )  
A function to be called When user select any denied File. You can process file name and extension to show custom message. Return True to override native alert message. The function gets passed two arguments: The file name and the file extension.

* **onAccept**  
Type: Function( String file, String extension )  
A function to be called When user select any acceptable File You can process with file name and extension. Return false to cancel selection. Most of the time the function is not needed. The function gets passed two arguments: The file name and the file extension.

* **onMaximumAllowedExceeded**  
Type: Function( SFileInput file, integer maximumAllowed )  
A function to be called When selected file count exceed the maximum allowed file. You will have the opportunity to handle here. Most of the time the function is not needed. The function gets passed two arguments: The SFileInput object and the maximumAllowed count.

* **showMessage**  
Type: Function( string message)  
Override the default message showing function. The function gets passed one arguments: The message.



Dependencies
============
To use this library you only need javascript support. 
