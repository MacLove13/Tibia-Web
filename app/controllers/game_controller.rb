# frozen_string_literal: true

class GameController < ApplicationController
  before_action :authenticate_account!
  before_action :valid_character_code?
  layout "game"

  def index
    @char_code = character_code
    @game_props = { account_id: current_account.id, auth: @char_code }
  end

  private

  def valid_character_code?
    return redirect_to '/characters' unless is_valid_character_code?
  end

  def is_valid_character_code?
    return false if character_code.nil?

    true
  end

  def character_code 
    @char_code ||= Character::Authentication.find_by(account_id: current_account.id)&.code
  end
end
