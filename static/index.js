$(document).ready(function() {
    function getNotes() {
        $.getJSON("/notes", function(data) {
            $("#notes-list").empty();
            data.forEach(function(note) {
                $("#notes-list").append(`<li class="list-group-item d-flex justify-content-between align-items-center" data-id="${note._id}">
                    ${note.note}
                    <button class="delete-note btn btn-danger btn-sm">Delete</button>
                </li>`);
            });
        });
    }

    $("#note-form").on("submit", function(event) {
        event.preventDefault();
        let note = $("#note").val();
        $.ajax({
            type: "POST",
            url: "/notes",
            contentType: "application/json",
            data: JSON.stringify({note: note}),
            success: function() {
                $("#note").val("");
                getNotes();
            }
        });
    });

    $("#notes-list").on("click", ".delete-note", function() {
        let noteId = $(this).parent().data("id");
        $.ajax({
            type: "DELETE",
            url: `/notes/${noteId}`,
            success: function() {
                getNotes();
            }
        });
    });

    $("#random-fact-button").on("click", function() {
        $.getJSON("/random_fact", function(data) {
            let note = data.fact;
            $.ajax({
                type: "POST",
                url: "/notes",
                contentType: "application/json",
                data: JSON.stringify({note: note}),
                success: function() {
                    getNotes();
                }
            });
        });
    });
    getNotes();
});
