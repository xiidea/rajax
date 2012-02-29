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
 

Current Active Version
======================
v 3.0

 
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


Dependencies
============
To use this library you only need javascript support. 

