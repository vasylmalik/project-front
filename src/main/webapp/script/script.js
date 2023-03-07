$(document).ready(function () {
    const table = $("#my-table");
    const tableBody = $("#t-body");
    const dropDown = $("#my-dropdown");
    const pageNumber = $("#page-number");

    function renderTable(pageSize, pageNumber) {
        $.get(`/rest/players/?pageNumber=${pageNumber}&pageSize=${pageSize}`, function (data) {
            tableBody.empty();
            $.each(data, function (i, member) {
                const row = `<tr>
                    <td>${i + data[0].id}</td>
                    <td>${member.name}</td>
                    <td>${member.title}</td>
                    <td>${member.race}</td>
                    <td>${member.profession}</td>
                    <td>${member.level}</td>
                    <td>${member.birthday}</td>
                    <td>${member.banned}</td>
                    <td><img src="img/edit.png" alt="Edit"></td>
                    </tr>`;
                table.append(row);
            });
        });
    }

    function renderPaginationButtons() {
        $.get('/rest/players/count', function (data) {
            let pageSize = dropDown.val();
            let chunk = Math.ceil(data / pageSize);
            pageNumber.empty();
            for (let i = 1; i <= chunk; i++) {
                let button = $('<button>' + i + '</button>');
                pageNumber.append(button);
                button.attr('id', 'b-num');
                button.attr('value', i);
                // Подкрасим номер текущей страницы
                if (i === pageNumber) {
                    button.addClass('active-page');
                }
                button.click(function () {
                    // Находим текущую активную страницу и снимаем с нее выделение
                    $('#page-number .active-page').removeClass('active-page');
                    // Изменяем фон только у кнопки, на которую кликнули
                    $(this).addClass('active-page');
                    // Вызываем функцию для загрузки данных для новой страницы
                    loadAccounts(pageSize, $(this).val());
                });
            }
        });
    }

    renderTable(5, 0);
    renderPaginationButtons();

    dropDown.click(() => {
        let pageSize = dropDown.val();
        renderTable(pageSize, 0);
        renderPaginationButtons();
    });

    pageNumber.on('click', 'button', function () {
        let pageSize = dropDown.val();
        let pageNumber = $(this).val() - 1;
        renderTable(pageSize, pageNumber);
    });
});