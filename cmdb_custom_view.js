function SearchAssets()
{
	//value of the button that was clicked
	var currentAssetTag = document.getElementById("searchParams").value;

	//builds asset card
	BuildAssetCard(currentAssetTag);
}


function BuildAssetCard(currentAssetTag)
{
	$j("#statusSection").empty();
	
	var assetCounter = 0;
	
	var displayName = '';
	var assignedTo = '';
	var reservedFor = '';
	var location = '';
	var department = '';
	var model = '';
	var computerName = '';
	var serialNumber = '';
	var assetTag = '';
	var status = '';
	var subStatus = '';
	
	var grAsset = new GlideRecord('alm_asset');
	grAsset.addQuery('asset_tag', currentAssetTag);
	grAsset.query();
	
	while(grAsset.next())
	{
		assetCounter++;
		
		displayName = grAsset.display_name;	
		assignedTo = GetUser(grAsset.assigned_to);
		reservedFor = GetUser(grAsset.reserved_for);		
		location = GetLocation(grAsset.location);
		department = GetDepartment(grAsset.department);
		model = GetModel(grAsset.model);
		computerName = GetCI(grAsset.ci);
		
		if(grAsset.serial_number == '') { serialNumber = 'No Data'; }
		else { serialNumber = grAsset.serial_number; }
		
		if(grAsset.asset_tag == '') { assetTag = 'No Data'; }
		else { assetTag = grAsset.asset_tag; }
		
		if(GetChoiceLabel('alm_asset', 'install_status', grAsset.install_status) == '') { status = 'No Data'; }
		else { status = GetChoiceLabel('alm_asset', 'install_status', grAsset.install_status); }
		
		if(GetChoiceLabel('alm_asset', 'substatus', grAsset.substatus) == '') { subStatus = 'No Data'; }
		else { subStatus = GetChoiceLabel('alm_asset', 'substatus', grAsset.substatus); }	
	}
	
	//if no asset was found from asset tag, search same number on serial number field
	if(assetCounter == 0)
	{
		var grSerial = new GlideRecord('alm_asset');
		grSerial.addQuery('serial_number', currentAssetTag);
		grSerial.query();
		
		while(grSerial.next())
		{
			assetCounter++;
		
			displayName = grSerial.display_name;
			assignedTo = GetUser(grSerial.assigned_to);
			reservedFor = GetUser(grSerial.reserved_for);
			location = GetLocation(grSerial.location);
			department = GetDepartment(grSerial.department);
			model = GetModel(grSerial.model);
			computerName = GetCI(grSerial.ci);

			if(grSerial.serial_number == '') { serialNumber = 'No Data'; }
			else { serialNumber = grSerial.serial_number; }

			if(grSerial.asset_tag == '') { assetTag = 'No Data'; }
			else { assetTag = grSerial.asset_tag; }

			if(GetChoiceLabel('alm_asset', 'install_status', grSerial.install_status) == '') { status = 'No Data'; }
			else { status = GetChoiceLabel('alm_asset', 'install_status', grSerial.install_status); }

			if(GetChoiceLabel('alm_asset', 'substatus', grSerial.substatus) == '') { subStatus = 'No Data'; }
			else { subStatus = GetChoiceLabel('alm_asset', 'substatus', grSerial.substatus); }
		}
	}
	
	if(assetCounter == 0) { alert('No asset was found with that asset tag'); document.getElementById("searchDivider").style.display = "none"; }
	else
	{
		document.getElementById("searchDivider").style.display = "block";
	
		$j("#statusSection").append("<div class='col-md-6 col-md-offset-3'><div class='panel widget'><div class='widget-header blue'><h3 style='font-size: 30px; text-align: center;'>" + displayName + "</h3></div><div class='widget-body'><img alt='Profile Picture' class='widget-img img-circle img-border-light' src='order_tracking_request_logo.png'/><hr/><h3>Users Information</h3><hr/><p><span style='padding-right: 5px; font-size: 30px;'>Assigned to:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + assignedTo + "</span></p><p><span clas='pull-right' style='padding-right: 5px; font-size: 30px;'>Reserved for:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + reservedFor + "</span></p><p><span style='padding-right: 5px; font-size: 30px;'>Location:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + location + "</span></p><p><span style='padding-right: 5px; font-size: 30px;'>Department:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + department + "</span></p><hr/><h3>Computer Information</h3><hr/><p><span style='padding-right: 5px; font-size: 30px;'>Model:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + model + "</span></p><p><span style='padding-right: 5px; font-size: 30px;'>Computer name:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + computerName + "</span></p> <p><span style='padding-right: 5px; font-size: 30px;'>Serial number:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + serialNumber + "</span></p><p><span style='padding-right: 5px; font-size: 30px;'>Asset tag:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + assetTag + "</span>	</p><p><span style='padding-right: 5px; font-size: 30px;'>Status:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + status + "</span></p><p><span style='padding-right: 5px; font-size: 30px;'>Sub status:</span><span style='font-weight: 600; font-size: 30px; padding-left:5px;'>" + subStatus + "</span></p><hr/></div></div></div>");
	}
}


function ClearAssets()
{
	document.getElementById("searchParams").value = '';
	document.getElementById("searchDivider").style.display = "none";
	document.getElementById("statusSection").innerHTML = '';
}

	




//gets state label
function GetChoiceLabel(currentTable, currentElement, currentValue)
{	
	var choiceLabel = '';
	
	//gets choice label from given value
	var grChoices = new GlideRecord('sys_choice');
	grChoices.addQuery('element', currentElement);
	grChoices.addQuery('name', currentTable);
	grChoices.addQuery('value', currentValue);
	grChoices.query();
			
	while(grChoices.next()) { choiceLabel = grChoices.label; }
	
	return choiceLabel;
}


//gets users name
function GetUser(usersSysID)
{
	var name = '';
	
	var grUser = new GlideRecord('sys_user');
	grUser.addQuery('sys_id', usersSysID);
	grUser.query();
	while(grUser.next()) { name = grUser.name; }
	
	if(name == '') { name = 'No Data'; }
	
	return name;
}


//gets users location
function GetLocation(locationSysID)
{
	var locationName = '';
	
	var grLocation = new GlideRecord('cmn_location');
	grLocation.addQuery('sys_id', locationSysID);
	grLocation.query();
	while(grLocation.next()) { locationName = grLocation.name; }
	
	if(locationName == '') { locationName = 'No Data'; }
	
	return locationName;
}


//gets users department
function GetDepartment(departmentSysID)
{
	var departmentName = '';
	
	var grDepartment = new GlideRecord('cmn_department');
	grDepartment.addQuery('sys_id', departmentSysID);
	grDepartment.query();
	while(grDepartment.next()) { departmentName = grDepartment.name; }
	
	if(departmentName == '') { departmentName = 'No Data'; }
	
	return departmentName;
}


//gets model
function GetModel(modelSysID)
{
	var modelName = '';
	
	var grModel = new GlideRecord('cmdb_model');
	grModel.addQuery('sys_id', modelSysID);
	grModel.query();
	while(grModel.next()) { modelName = grModel.display_name; }
	
	if(modelName == '') { modelName = 'No Data'; }
	
	return modelName;
}


//gets CI
function GetCI(CISysID)
{
	var CIName = '';
	
	var grCI = new GlideRecord('cmdb');
	grCI.addQuery('sys_id', CISysID);
	grCI.query();
	while(grCI.next()) { CIName = grCI.name; }
	
	if(CIName == '') { CIName = 'No Data'; }
	
	return CIName;
}
