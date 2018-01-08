require 'rails_helper'

RSpec.describe TasksController, type: :controller do

	describe "tasks#index" do
		it "should list the objects in the database in the correct order" do
			task1 = FactoryBot.create(:task)
			task2 = FactoryBot.create(:task)
			task1.update_attributes(title: "Something Else")
			get :index
			expect(response).to have_http_status :success
			response_value = ActiveSupport::JSON.decode(@response.body)
			expect(response_value.count).to eq(2)
			# could achive this with this code - but is less readable so stick with longer form
			#response_ids = response_value.collect do |task|
			#	task["id"]
			#end
			response_ids = []
			response_value.each do |task|
				response_ids << task["id"]
			end
			expect(response_ids).to eq([task1.id, task2.id])
		end
	end


	describe "tasks#update" do

		it "should update tasks in the database, marked as done" do
			task = FactoryBot.create(:task, done: false)
			put :update, id: task.id, task: { done: true }
			expect(response).to have_http_status(:success)
			task.reload
			expect(task.done).to eq(true)
		end

	end


end
