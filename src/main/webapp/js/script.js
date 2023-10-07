function validateInput() {
    var input_level_new = Number(
        document.getElementById("input_level_new").value
    );

    if (input_level_new < 0 || input_level_new > 100) {
        alert("Value " + input_level_new + " is not allowed.");
        document.getElementById("input_level_new").value = ""
    } else if (input_level_new == "") {
        alert("empty value is not allowed");
    } else {
        createAcc();
    }
}

async function show_list(page_number) {
    $("tr:has(td)").remove();
    let url = "/rest/players";
    let countPerPage = $("#count").val();
    if (countPerPage == null) {
        countPerPage = 3;
    }

    url = url.concat("?pageSize=").concat(countPerPage);

    if (page_number == null) {
        page_number = 0;
    }

    url = url.concat("&pageNumber=").concat(page_number);

    $.get(url, function (response) {
        $.each(response, function (i, item) {
            $('<tr>').html(
                "<td class='table-cell'>" + item.id + "</td>" +
                "<td class='table-cell'>" + item.name + "</td>" +
                "<td class='table-cell'>" + item.title + "</td>" +
                "<td class='table-cell'>" + item.race + "</td>" +
                "<td class='table-cell'>" + item.profession + "</td>" +
                "<td class='table-cell'>" + item.level + "</td>" +
                "<td class='table-cell'>" + new Date(item.birthday).toLocaleDateString() + "</td>" +
                "<td class='table-cell'>" + item.banned + "</td>" +
                "<td class='table-cell'>" + "<button id='button_edit" + item.id + "' onclick='editAcc(" + item.id + ")'>" + "<img src='/img/edit.png'>" + "</button>" + "</td>" +
                "<td class='table-cell'>" + "<button id='button_delete" + item.id + "' onclick='deleteAcc(" + item.id + ")'>" + "<img src='/img/delete.png'>" + "</button>" + "</td>"
            ).appendTo("#myTable");
        })
    });
    let getCount = await getCountOfAccounts();

    let pageCounter = Math.ceil(getCount / countPerPage);
    $("button.pgn-bnt-styled").remove();
    for (let i = 0; i < pageCounter; i++) {
        let button_tag = "<button>" + (i + 1) + "</button>";
        let btn = $(button_tag)
            .attr("id", "paging-section" + i)
            .attr("onclick", "show_list(" + i + ")")
            .addClass("pgn-bnt-styled");
        $("#paging-section").append(btn);
    }

    let identifier = "#paging-section" + page_number;
    $(identifier).css("color", "green");

}

function getCountOfAccounts() {
    let url = "/rest/players/count";
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            success: function (result) {
                let res = parseInt(result);
                resolve(res);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function deleteAcc(id) {
    let url = "/rest/players/" + id;
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function () {
            show_list(getCurrentPage());
        }
    })
}

function editAcc(id) {
    let identifier_edit = "#button_edit" + id;
    let identifier_delete = "#button_delete" + id;

    $(identifier_delete).remove();

    let save_image_tag = "<img src = '/img/save.png'>";
    $(identifier_edit).html(save_image_tag);

    let current_tr_element = $(identifier_edit).parent().parent();
    let children = current_tr_element.children();

    let td_name = children[1];
    td_name.innerHTML = "<input id = 'input_name" + id + "' type = 'text' value ='" + td_name.innerHTML + "'>";

    let td_title = children[2];
    td_title.innerHTML = "<input id = 'input_title" + id + "' type = 'text' value ='" + td_title.innerHTML + "'>";

    let td_race = children[3];
    let race_id = "#select_race" + id;
    let race_current_value = td_race.innerHTML;
    td_race.innerHTML = getDropdownRaceHtml();
    $(race_id).val(race_current_value).change();

    let td_profession = children[4];
    let profession_id = "#select_profession" + id;
    let profession_current_value = td_profession.innerHTML;
    td_profession.innerHTML = getDropdownProfessionHtml();
    $(profession_id).val(profession_current_value).change();

    let td_banned = children[7];
    let banned_id = "#select_banned" + id;
    let banned_current_value = td_banned.innerHTML;
    td_banned.innerHTML = getDropdownBannedHtml();
    $(banned_id).val(banned_current_value).change();

    let property_save_tag = "saveAcc(" + id + ")";
    $(identifier_edit).attr('onclick', property_save_tag);
}

function createAcc() {
    let value_name = $("#input_name_new").val();
    let value_title = $("#input_title_new").val();
    let value_race = $("#input_race_new").val();
    let value_profession = $("#input_profession_new").val();
    let value_level = $("#input_level_new").val();
    let value_birthday = $("#input_birthday_new").val();
    let value_banned = $("#input_banned_new").val();

    let url = "/rest/players";
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            "name": value_name,
            "title": value_title,
            "race": value_race,
            "profession": value_profession,
            "banned": value_banned,
            "level": value_level,
            "birthday": new Date(value_birthday).getTime()
        }),
        success: function () {
            $("#input_name_new").val("");
            $("#input_title_new").val("");
            $("#select_race_new").val("");
            $("#select_profession_new").val("");
            $("#select_level_new").val("");
            $("#select_birthday_new").val("");
            $("#select_banned_new").val("");
            show_list(getCurrentPage(""));
        }
    })
}

function saveAcc(id) {
    let value_name = $("#input_name" + id).val();
    let value_title = $("#input_title" + id).val();
    let value_race = $("#select_race" + id).val();
    let value_profession = $("#select_profession" + id).val();
    let value_banned = $("#select_banned" + id).val();

    let url = "/rest/players/" + id;
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            "name": value_name,
            "title": value_title,
            "race": value_race,
            "profession": value_profession,
            "banned": value_banned
        }),
        success: function () {
            show_list(getCurrentPage());
        }
    })
}

function getDropdownRaceHtml(id) {
    let race_id = "select_race" + id;

    return "<label for='race'></label>" +
        "<select id='" + race_id + "'>" +
        "<option value='HUMAN'>HUMAN</option>" +
        "<option value='DWARF'>DWARF</option>" +
        "<option value='ELF'>ELF</option>" +
        "<option value='GIANT'>GIANT</option>" +
        "<option value='ORC'>ORC</option>" +
        "<option value='TROLL'>TROLL</option>" +
        "<option value='HOBBIT'>HOBBIT</option>" +
        "</select>";
}

function getDropdownProfessionHtml(id) {
    let class_id = "select_profession" + id;

    return "<label for='profession'></label>" +
        "<select id='" + class_id + "'>" +
        "<option value='WARRIOR'>WARRIOR</option>" +
        "<option value='ROGUE'>ROGUE</option>" +
        "<option value='SORCERER'>SORCERER</option>" +
        "<option value='CLERIC'>CLERIC</option>" +
        "<option value='PALADIN'>PALADIN</option>" +
        "<option value='NAZGUL'>NAZGUL</option>" +
        "<option value='WARLOCK'>WARLOCK</option>" +
        "<option value='DRUID'>DRUID</option>" +
        "</select>";
}

function getDropdownBannedHtml(id) {
    let select_id = "select_banned" + id;

    return "<label for='banned'></label>" +
        "<select id='" + select_id + "'>" +
        "<option value='true'>true</option>" +
        "<option value='false'>false</option>" +
        "</select>";
}

function getCurrentPage() {
    let current_page = 1;
    $('button:parent(div)').each(function () {
        if ($(this).css('color') === 'rgb(255,0,0)') {
            current_page = $(this).text();
        }
    })
    return parseInt(current_page) - 1;
}
