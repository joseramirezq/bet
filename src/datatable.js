// datatables.js
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-buttons/js/buttons.colVis.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';

$.extend(true, $.fn.dataTable.Buttons.defaults, {
  dom:
    "<'row '<'col-sm-12 mb-3 'B>><'row '<'col-sm-12 col-md-6 'l><'col-sm-12 col-md-6'f>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
  buttons: [
    {
      extend: "excelHtml5",
      text: "<i class='bi bi-file-earmark-excel'></i> Excel",
      titleAttr: "Exportar a Excel",
      className: "btn btn-outline-success"
    },
    {
      extend: "pdfHtml5",
      text: "PDF",
      titleAttr: "Exportar a PDF",
      className: "btn btn-outline-danger"
    }
  ],
  pageLength: 20 
});

