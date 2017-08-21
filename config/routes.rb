Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'application#index'
  get :geocode, to: 'application#geocode_result'
  post :geocode, to: 'application#geocode'
  get :geocode_update, to: 'application#geocode_update'
end
