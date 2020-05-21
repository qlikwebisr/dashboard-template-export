/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );

var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
//to avoid errors in workbench: you can remove this when you have added an app
var app;
require.config({
	baseUrl: (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + config.prefix + "resources"
});

require(["js/qlik"], function (qlik) {
	window.qlik = qlik;
	
	qlik.setOnError( function (error) {
		console.log(error);
	});

	

	//callbacks -- inserted here --
	//open apps -- inserted here --

	//get objects -- inserted here --
	//create cubes and lists -- inserted here --


	if (app) {
		app.getObject('CurrentSelections','CurrentSelections');
		$(".filter-drawer-toggle, paper-menu paper-item").click(function() {
			qlik.resize();
		});
	} else {
		$(".current-selections-placeholder span").css("display", "inline-block");
	}
	
	/* ========== Export to EXCEl file feature code ==========  */
	//Added button <button class="export-button"><i class="fa fa-file-excel-o" aria-hidden="true"></i></button>
	//in qliksense-card.html and css in dashboard.css

	// Excel Export Function

	$(document).ready(function() {

		$(document).on('click', ".export-button", function(e) {

			//console.log('export-button clicked');

			//find ID of the hypercube element
			var hypercubeElem = $(this).parent().parent().find('.qvobject').attr('id');
			//Pure JS version
			//var hypercubeElem = this.parentElement.querySelector('.qvobject').id;

			//console.log('hypercubeElem: ',hypercubeElem);
			//https://community.qlik.com/t5/Qlik-Sense-Integration-Extensions-APIs/How-to-get-the-object-ID-based-on-a-div-in-a-Mashup/m-p/1168462
			//find object ID
			var el = document.getElementById(hypercubeElem);
			var objScope = angular.element(el.children[0]).scope();
			var objId = objScope.model.id;

			//console.log('export_clicked: ' + objId); 

			//create vizualization object
			app.visualization.get(objId).then( function( vizModel ) { 

				exportData(vizModel);

			});

			//second option
			//https://community.qlik.com/t5/QlikView-Layout-Visualizations/Adding-quot-Export-Data-quot-to-DAR-Template/m-p/46999
			/* var downloaddiv = $(this).parent().parent().find('.qvobject')[0];
			var objScope = angular.element(downloaddiv.children[0]).scope();
			var objId = objScope.model.id;
			app.getObject(objId).then(function(model) {
					var table = qlik.table(model);
					table.exportData({download: true});
			});   */

		});  //$(document).on('click', ".export-button", function(e) {

	}); //$(document).ready(function() {

	//export excel file from visualizated model
	function exportData(model) {

		model.table.exportData().then(function(qUrl) {     

			//console.log('qUrl', qUrl);

			window.open(qUrl);

	    }); 

	} //function exportData(model) {

	/* ========== Export to EXCEl file feature code end ==========  */
	
});
