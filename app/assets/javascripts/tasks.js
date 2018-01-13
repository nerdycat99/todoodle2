  $(function() {
    // The taskHtml method takes in a JavaScript representation
    // of the task and produces an HTML representation using
    // <li> tags
    function taskHtml(task) {
      var checkedStatus = task.done ? "checked" : "";
      var liClass = task.done ? "completed" : "";
      var liElement = '<li id="listitem-' + task.id + '" class="' + liClass + '">' + 
      '<div class="view"><input class="toggle" type="checkbox"' +
        " data-id='" + task.id + "'" +
        checkedStatus +
        '><label class="item-text">' +
         task.title +
         '</label></div></li>';

      return liElement;
    }


    // function that is run when user changes a toggle class item
    function toggleItems(e) {
      var itemId = $(e.target).data("id");

      var checkValue = Boolean($(e.target).is(':checked'));

      $.post("/tasks/" + itemId, {
        _method: "PUT",
        task: {
          done: checkValue
        }
      }).success(function(data) { // presume data is the object being toggled.
        var liHtml = taskHtml(data);
        var $li = $("#listitem-" + data.id);
        $li.replaceWith(liHtml);
        $('.toggle').change(toggleItems); // re-register this item to be picked up by the click event handler - this makes it un cross through the text when we subsequently toggle as not complete
      });
    }


    // I think this is calling the /tasks GET action from Rails, basically 
    // the def index that spits out all data from the database in the correct order.
    $.get("/tasks").success( function( data ) {
      var htmlString = "";

      $.each(data, function( index, task ) {      
         htmlString += taskHtml(task)
      });

      var ulTodos = $('.todo-list');
      ulTodos.html(htmlString);

      // I think this sets up an event handler for when the done box is 'toggled'
      // it calls toggleItems and somehow passes through a reference to the item
      // that was chcked
      $('.toggle').change(toggleItems);

    });
    // detects an input into the textfield
    $('#new-form').submit(function(event) {
      event.preventDefault();  // can't remember why we have to supress something?
      var textbox = $('.new-todo');

      var newTaskItem = {
        task: {
          title: textbox.val()
        }
      };
      // handles creating a new item 
      $.post("/tasks", newTaskItem).success(function(data) {
        var htmlString = taskHtml(data)
        var ulTodos = $('.todo-list');
        ulTodos.append(htmlString); // adds this to the end of the li section populated on page load
        // NB this adds items to teh page AFTER the click event handler is added to page, this means that only after you refresh the page (and click event handler loads again to monitor all taks which will not include what we just added) does the new item click get acted upon. Below resolves
        $('.toggle').change(toggleItems);
        $('.new-todo').val('');  // clears the text entry
      }); 
    });

  });