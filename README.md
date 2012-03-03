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
v 3.1

 
USES
====
Rajax Form with styled input button


    var rajax_obj=new rajax(form,
     {
    		 finputs:
    		   {
    			profile_pic1:
    				{
    					button:'file_uploader1',
    					allowedType:'image'		
    				},
    			doc_attachment:
    				{
    					button:'file_uploader2',
    					allowedType:'document'
    				}
    		   },
    		action:'submitto.php',
    		onSubmit:function()
    				{
    					
    				},
    		onComplete:function(response)
    				{
    				}	
    		});
    rajax_obj.post();	//Triger submitting the form
 
Styled Input Only

    sInput=new SFileInput('doc_file',
    		{
    			button:'doc_upload1',
    			allowedType:'document',
    			selectedFileLabel:'selected_doc_file1',
    			multipleFile:true,
    			selectedFileClass:'selectedFileClass'
    		});

* **Cross domain Implementation**

Cross domain communication need some extra scripting and its till experimental. only checked on FF10, IE9, Chrome17. Hope fully it should work on other version of browser. To perform cross browser submission you need to follow the steps bellow:

* Place **blank.html** file in your working directory or any other location and assign as **localResource** value.
                                                                                                       
<pre>
    var rajax_obj=new rajax(form,
      {
    	  localResource:"path/to/local/blank.html"
      });
</pre>

* Remote Server Scripting: You need to add a javascript code on the page of remote domain

To pass Your Message

    <script>
    	window.name="Your Message Here";
    </script>

or To pass Full Body COntent

    <script>
     window.name=document.documentElement.innerHTML;
    </script>



Dependencies
============
To use this library you only need javascript support. 
