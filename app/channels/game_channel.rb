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



    if data['player']['direction'] == 'down'
      new_position = {
        x: data['player']['position']['x'].to_i,
        y: data['player']['position']['y'].to_i + 1,
      }
    elsif data['player']['direction'] == 'up'
      new_position = {
        x: data['player']['position']['x'].to_i,
        y: data['player']['position']['y'].to_i - 1,
      }
    elsif data['player']['direction'] == 'left'
      new_position = {
        x: data['player']['position']['x'].to_i - 1,
        y: data['player']['position']['y'].to_i,
      }
    elsif data['player']['direction'] == 'right'
      new_position = {
        x: data['player']['position']['x'].to_i + 1,
        y: data['player']['position']['y'].to_i,
      }
    else
      new_position = {
        x: data['player']['position']['x'].to_i,
        y: data['player']['position']['y'].to_i,
      }
    end


    puts new_position
    tile = Map::Tile.find_by(x: new_position[:x], y: new_position[:y])

    if tile.present? && tile.walkable
      ActionCable.server.broadcast("game_#{params[:game_id]}", { action: 'move', player: data['player'], new_position: new_position })
    else
      ActionCable.server.broadcast("game_#{params[:game_id]}", {
        action: 'notification',
        message: "This tile is nos walkable"
      })
    end
  end

  def update_map
    map = {
      tiles: Map::Tile.all
    }

    ActionCable.server.broadcast("game_#{params[:game_id]}", { action: 'update_map', map: map })
  end

  def update_tile(data)
    tile = Map::Tile.find_by(x: data['x'].to_i, y: data['y'].to_i)

    if tile.nil?
      Map::Tile.create(
        x: data['x'].to_i,
        y: data['y'].to_i,
        tileType: data['new_type'].to_s,
        walkable: data['walkable']
      )
    else
      tile.update(
        tileType: data['new_type'].to_s,
        walkable: data['walkable']
      )
    end

    map = {
      tiles: Map::Tile.all
    }

    ActionCable.server.broadcast("game_#{params[:game_id]}", { action: 'update_map', map: map })
  end
end
