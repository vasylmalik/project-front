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
                    <td data-id="${member.id}">${member.id}</td>
                    <td><span class="name">${member.name}</span></td>
                    <td><span class="title">${member.title}</span>></td>
                    <td><span class="race">${member.race}</span>></td>
                    <td><span class="profession">${member.profession}</span></td>
                    <td><span class="level">${member.level}</span></td>
                    <td><span class="birthday">${new Date(member.birthday).toLocaleDateString()}</span></td>
                    <td><span class="banned">${member.banned}</span></td>
                    <td><button class="btn-edit" data-id="${member.id}"><img src="img/edit.png" alt="Edit"></button></td>
                    <td><button class="btn-delete" data-id="${member.id}"><img src="img/delete.png" id="img-delete" alt="Delete"></button></td>
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
                if (error.status === 404) {
                    alert(`Error deleting user: ${error}. Player is not found.`);
                } else if (error.status === 400) {
                    alert(`Error deleting user: ${error}. Invalid ID.`);
                } else {
                    alert(`Error deleting user: ${error}`);
                }
            }
        });
    }

    tableBody.on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        deleteAccount(id);
    });

    tableBody.on('click', '.btn-edit', function () {
        $(this).find('img').attr('src', 'img/save.png');
        $(this).closest('tr').find('.btn-delete').toggle();

        const row = $(this).closest('tr');
        const id = row.attr('data-id');
        const name = row.find('.name').text();
        const title = row.find('.title').text();
        const race = row.find('.race').text();
        const profession = row.find('.profession').text();
        const banned = row.find('.banned').text() === 'true';

        let val_name = row.find('.name').html(`<input type="text" name="name" value="${name}">`);
        let val_title = row.find('.title').html(`<input type="text" name="title" value="${title}">`);
        let val_race = row.find('.race').html(`<input type="text" name="race" value="${race}">`);
        let val_profession = row.find('.profession').html(`<input type="text" name="profession" value="${profession}">`);
        let val_banned = row.find('.banned').html(`
        <select name="banned">
            <option value="true" ${banned ? 'selected' : ''}>true</option>
            <option value="false" ${!banned ? 'selected' : ''}>false</option>
        </select>
    `);

        $('.btn-edit').off('click').on('click', function () {
            var id = $(this).data('id');
            $.ajax({
                url: `/rest/players/${id}`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: val_name.find('input').val(),
                    title: val_title.find('input').val(),
                    race: val_race.find('input').val(),
                    profession: val_profession.find('input').val(),
                    banned: val_banned.find('select').val() === 'true'
                }),
                success: function () {
                    renderTable(dropDown.val(), pageNum);
                    renderPaginationButtons();
                },
                error: function (error) {
                    if (error.status === 404) {
                        alert(`Error editing user: ${error}. Player is not found in the database.`);
                    } else if (error.status === 400) {
                        alert(`Error editing user: ${error}. Invalid ID.`);
                    } else {
                        alert(`Error editing user: ${error}`);
                    }
                }
            });
        });
    });

    pageNumber.on('click', 'button', function () {
        let pageSize = dropDown.val();
        pageNum = $(this).val() - 1;
        renderTable(pageSize, pageNum);
    });
});