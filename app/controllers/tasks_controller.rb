class TasksController < ApplicationController

  def create
    # push item into the database on the /tasks POST 
    task = Task.create(task_params)
    # render JSON response??? - I think this 'exposes' the rails http post request to javascript?
    # run - $.post("/tasks", newTaskItem).success(function(data) { .... }); - on view to call this action
    render json: task
  end

	def index
		render json: Task.order(:id)
	end

  def update
    task = Task.find(params["id"])
    task.update_attributes(task_params)
    render json: task
  end

  private

  def task_params
    params.require(:task).permit(:done, :title)
  end

end
