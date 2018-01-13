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
    // e must be getting the reference to the item - ** FIND OUT HOW.
    function toggleItems(e) {
      var itemId = $(e.target).data("id");

      var checkValue = Boolean($(e.target).is(':checked'));

      $.post("/tasks/" + itemId, {
        _method: "PUT",
        task: {
          done: checkValue
        }
      }).success(function(data) { // data is the object being toggled.
        var liHtml = taskHtml(data); // recreate the HTML rep for task (with completed class set)
        var $li = $("#listitem-" + data.id);
        $li.replaceWith(liHtml); // replace the current task HTML with that which includes the completed class, value there causes strikethru.
        $('.toggle').change(toggleItems); // re-register this item to be picked up by the click event handler - when user subsequently clicks again it will re-run code from a toggle and rebuild HTML with the completed class blank so no strike thru
      });
    }


    // This is calling the /tasks GET action from Rails, basically the def index 
    // that spits out all data from the database in the correct order > into data
    $.get("/tasks").success( function( data ) {
      var htmlString = "";

      // iterate through data JSON array(??), pass the task object to taskHtml method
      $.each(data, function( index, task ) {      
         htmlString += taskHtml(task) // returns HTML for each task - htmlString contains a set of HTML for each and every task
      });

      // set the html property of the todo-list class
      var ulTodos = $('.todo-list');
      ulTodos.html(htmlString);

      // Sets up an event handler after setting the todo-list class html (i.e. populating the page)
      // When the done box is 'toggled' toggleItems is called - ***NB: not clear how toggleItems has a reference to a specific item
      $('.toggle').change(toggleItems);

    });
    // detects an input into the textfield with enter key
    // an improvement might be checking user hasn't hit enter key with no text
    $('#new-form').submit(function(event) {
      event.preventDefault();  // supress reload of the page when Enter key hit.
      var textbox = $('.new-todo');
      
      var newTaskItem = {
        task: {
          title: textbox.val()
        }
      };

      // inserted by me to check if user entered something, only then create item
      if (requiredInput(newTaskItem.task.title)) {

        // handles creating a new item - if we have a valid task!
        $.post("/tasks", newTaskItem).success(function(data) {
          var htmlString = taskHtml(data) // create a new HTML reprenstation of task
          var ulTodos = $('.todo-list');
          ulTodos.append(htmlString); // adds HTML rep of task to the li section on page.
          
          // Finally since this task was added to page after the event handler initially registered on page load.
          // need to re-register this task with click event handler. If we did not do this no action taken when new item is clicked until page refreshed.
          $('.toggle').change(toggleItems);
          $('.new-todo').val('');  // clears the text entry too
        }); 
      } // end of my if statement to check input
    });


    function requiredInput(input) {
      if (input.length ==0 ) {
        alert("Sorry you cannot create an item without a description, please try again. If you just need to do nothing, that's fine, go relax.");
        return false
      }
      return true
    }

  });