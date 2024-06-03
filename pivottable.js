
        function pivot(input_arr,info) {
            var seen_periods = {};
            var periods_in_order = [];

            var identifier_to_period_value = {};

            for(let i = 0; i < input_arr.length; i++) {
                const row = input_arr[i];

                if(!identifier_to_period_value[row[0]]) {
                    identifier_to_period_value[row[0]] = {};
                }

                identifier_to_period_value[row[0]][row[1]] = row[2];

                if (!seen_periods[row[1]]) {
                    seen_periods[row[1]] = true;
                }
            }

            periods_in_order = Object.keys(seen_periods);
            periods_in_order.sort();

            var all_identifiers = Object.keys(identifier_to_period_value);
            all_identifiers.sort();

            var header = [info];
            periods_in_order.forEach(function(period) {
                header.push(period);
            });

            var rows = [header];

            all_identifiers.forEach(function(identifier) {
                var new_row = [identifier];
                periods_in_order.forEach(function(period) {
                    new_row.push(identifier_to_period_value[identifier][period] || "-");
                });

                rows.push(new_row);
            });

            return rows;
        }

        function getInputData(inputtableid) {
            const table = document.getElementById(inputtableid);
            const rows = table.getElementsByTagName('tr');
            const data = [];

            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName('td');
                const row = [];
                for (let j = 0; j < cells.length; j++) {
                    row.push(cells[j].innerText);
                }
                data.push(row);
            }

            return data;
        }

        function renderPivotTable(pivotData, pivotTableID) {
		
            const pivotTable = document.getElementById(pivotTableID);
			ttable = document.createElement('table');
			ttable.classList.add('DataTable','pivot','display');
			pivotTable.appendChild(ttable);
			thead = document.createElement('thead');
			ttable.appendChild(thead);
			tbody = document.createElement('tbody');
			ttable.appendChild(tbody);


            thead.innerHTML = '';
            tbody.innerHTML = '';

            const headerRow = document.createElement('tr');
            pivotData[0].forEach(header => {
                const th = document.createElement('th');
                th.innerText = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            for (let i = 1; i < pivotData.length; i++) {
                const row = document.createElement('tr');
                pivotData[i].forEach(cell => {
                    const td = document.createElement('td');
                    td.innerText = cell;
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
			// 定義表格 ID 和對應的資料 ID
			const tableIds = ['pivotTable_formulation', 'pivotTable_process', 'pivotTable_target'];
			const dataIds = ['temp_tidy_formulation', 'temp_tidy_process', 'temp_tidy_target'];
			const infoIds = ['配方代號表','製程代號表','對象代號表']

			// 迴圈處理每個表格和對應的資料
			for (let i = 0; i < tableIds.length; i++) {
				const inputData = getInputData(dataIds[i]);
				const pivotData = pivot(inputData,infoIds[i]);
				renderPivotTable(pivotData, tableIds[i]);
				const table = document.getElementById(dataIds[i]);
				table.parentNode.removeChild(table);
			}

        });
		
		$(document).ready(function(){
			$('#interactiveTable').DataTable({
				dom: 'Bfrtip',
				
				paging:false,
				buttons: ['copy', 'csv', 'excel', 'pdf', 
                    {
                        extend: 'print',
                        text: 'Print all tables',
                        exportOptions: {
                            modifier: {
                                search: 'applied',
                                order: 'applied'
                            }
                        },
                        customize: function (win) {
                            // 获取所有表格的HTML
                            var allTablesHtml = '';
                            $('table.display').each(function () {
                                allTablesHtml += $(this).clone().wrap('<div>').parent().html();
                            });
                            // 将所有表格的HTML添加到打印窗口
                            $(win.document.body).html(allTablesHtml);
                        }
                    }
				]
			});
			// 初始化 DataTables
			$('table.pivot').DataTable({paging:false,searching: false, info:false});
			/*
			var inputbox = document.getElementById("interactiveTable_filter").querySelector("input");
			$(inputbox).on('keyup',function(){
				var searchTerm = $(this).val();
				$('table.pivot').DataTable().search(searchTerm).draw(); 
			})
			*/
		});
