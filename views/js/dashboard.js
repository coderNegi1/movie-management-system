

$(document).ready(function () {
    $('#dashtable').DataTable({
        "paging": true,        // Enable pagination
        "lengthMenu": [5, 10, 25, 50], // Customize number of rows per page
        "pageLength": 5,       // Default number of rows per page
        "ordering": true,      // Enable sorting
        "searching": true      // Enable search filter
    });
});









// csv

// $(document).ready(function () {
//     $('#dashtable').DataTable({
//         "paging": true,       // Pagination enable karega
//         "searching": true,    // Search box enable karega
//         "ordering": true,     // Sorting enable karega
//         "info": true,         // Table info show karega
//         "dom": '<"dt-buttons"B>frtip', // Buttons ke liye custom placement
//         "buttons": [
//             {
//                 extend: 'copy',
//                 text: '📋 Copy',
//                 className: 'btn btn-primary',
//                 exportOptions: {
//                     columns: ':not(:nth-last-child(-n+2))' // Last 2 columns (Images + Actions) ko exclude karega
//                 }
//             },
//             {
//                 extend: 'csv',
//                 text: '📄 CSV',
//                 className: 'btn btn-primary',
//                 exportOptions: {
//                     columns: ':not(:nth-last-child(-n+2))'
//                 }
//             },
//             {
//                 extend: 'excel',
//                 text: '📊 Excel',
//                 className: 'btn btn-success',
//                 exportOptions: {
//                     columns: ':not(:nth-last-child(-n+2))'
//                 }
//             },
//             {
//                 extend: 'pdf',
//                 text: '📜 PDF',
//                 className: 'btn btn-danger',
//                 exportOptions: {
//                     columns: ':not(:nth-last-child(-n+2))'
//                 }
//             },
//             {
//                 extend: 'print',
//                 text: '🖨 Print',
//                 className: 'btn btn-dark',
//                 exportOptions: {
//                     columns: ':not(:nth-last-child(-n+2))'
//                 }
//             }
//         ]
//     });
// });
