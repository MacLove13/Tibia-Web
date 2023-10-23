class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_#{params[:game_id]}"
  end

  def move(data)

    puts '========================'

    character = Character::Authentication.find_by(
      account_id: data['account']['identifier'],
      code: data['account']['auth']
    )

    if character.nil?
      return ActionCable.server.broadcast("game_#{params[:game_id]}", { action: 'disconnect' })
    end

    # if data['player']['direction'] == 'down'
    #   new_position = {
    #     x: data['player']['position']['x'].to_i,
    #     y: data['player']['position']['y'].to_i + 1,
    #   }
    # elsif data['player']['direction'] == 'up'
    #   new_position = {
    #     x: data['player']['position']['x'].to_i,
    #     y: data['player']['position']['y'].to_i - 1,
    #   }
    # elsif data['player']['direction'] == 'left'
    #   new_position = {
    #     x: data['player']['position']['x'].to_i - 1,
    #     y: data['player']['position']['y'].to_i,
    #   }
    # elsif data['player']['direction'] == 'right'
    #   new_position = {
    #     x: data['player']['position']['x'].to_i + 1,
    #     y: data['player']['position']['y'].to_i,
    #   }
    # else
    #   new_position = {
    #     x: data['player']['position']['x'].to_i,
    #     y: data['player']['position']['y'].to_i,
    #   }
    # end

    ActionCable.server.broadcast("game_#{params[:game_id]}", { action: 'move', player: data['player'], new_position: new_position })
  end
end
