Rails.application.routes.draw do
  resources :item_templates
  resources :characters, only: [:new, :create]
  namespace :characters do
    get '/', action: :index
    get 'play/:character_id', action: :play
  end

  devise_for :accounts, controllers: { registrations: 'accounts/registrations' }

  get 'home/index'
  get 'game', to: 'game#index'
  
  get "up" => "rails/health#show", as: :rails_health_check

  mount ActionCable.server => '/cable'

  root "home#index"
end
