class CharactersController < ApplicationController
  before_action :authenticate_account!

  def index
    @characters = current_account.characters
  end

  def new
    @character = Character.new
  end

  def create
    @character = Character.new(character_params)
    @character.account_id = current_account.id
    if @character.save
      redirect_to '/characters', notice: 'Personagem criado com sucesso.'
    else
      render :new
    end
  end

  def play
    character = Character.find_by(id: params[:character_id])
    return redirect_to '/characters' if character.nil?

    Character::Authentication.where(account_id: current_account.id).delete_all

    Character::Authentication.create(
      account_id: current_account.id,
      character_id: character.id,
      code: "a#{Time.current.to_i}"
    )

    redirect_to '/game'
  end

  private

  def character_params
    params.require(:character).permit(:name, :account_id)
  end
end
