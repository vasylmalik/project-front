$(document).ready(function () {
    const table = $("#my-table");
    const tableBody = $("#t-body");
    const dropDown = $("#my-dropdown");
    const pageNumber = $("#page-number");
    let pageNum = pageNumber.val();

    function renderTable(pageSize, pageNumber) {
        $.get(`/rest/players/?pageNumber=${pageNumber}&pageSize=${pageSize}`, function (data) {
            tableBody.empty();
            $.each(data, function (i, member) {
                const row = `<tr>
                    <td>${member.id}</td>
                    <td>${member.name}</td>
                    <td>${member.title}</td>
                    <td>${member.race}</td>
                    <td>${member.profession}</td>
                    <td>${member.level}</td>
                    <td>${new Date(member.birthday).toLocaleDateString()}</td>
                    <td>${member.banned}</td>
                    <td><button class="btn-edit"><img src="img/edit.png" alt="Edit"></button></td>
                    <td><button class="btn-delete" data-id="${member.id}"><img src="img/delete.png" alt="Delete"></button></td>
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
                let button = $('<button><span>' + i + '</span></button>');
                pageNumber.append(button);
                button.attr('id', 'b-num');
                button.attr('value', i);

                if (i === pageNum + 1) {
                    button.find('span').addClass('active-page');
                }
                button.click(function () {
                    $('#page-number .active-page').removeClass('active-page');
                    $(this).find('span').addClass('active-page');

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

    function deleteAccount(id) {
        const btn = $(this);
        $.ajax({
            url: `/rest/players/${id}`,
            type: 'DELETE',
            success: function () {
                btn.closest('tr').remove();
                renderTable(dropDown.val(), pageNum);
                renderPaginationButtons();
                console.log(`User with id: ${id} deleted successfully`);
            },
            error: function (error) {
                alert(`Error deleting user: ${error}`);
            }
        });
    }

    tableBody.on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        deleteAccount(id);
    });

    tableBody.on('click', '.btn-edit', function () {
        $(this).find('img').attr('src','img/save.png');
    });

    pageNumber.on('click', 'button', function () {
        let pageSize = dropDown.val();
        pageNum = $(this).val() - 1;
        renderTable(pageSize, pageNum);
    });
});