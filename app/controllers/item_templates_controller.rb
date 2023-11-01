class ItemTemplatesController < ApplicationController
  before_action :set_item, only: %i[ show edit update destroy ]

  # GET /items or /items.json
  def index
    @item_templates = ItemTemplate.all
  end

  # GET /items/1 or /items/1.json
  def show
  end

  # GET /items/new
  def new
    @item_template = ItemTemplate.new
  end

  # GET /items/1/edit
  def edit
  end

  # POST /items or /items.json
  def create
    @item_template = ItemTemplate.new(item_params)

    respond_to do |format|
      if @item_template.save
        format.html { redirect_to item_url(@item_template), notice: "Item was successfully created." }
        format.json { render :show, status: :created, location: @item_template }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @item_template.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /items/1 or /items/1.json
  def update
    respond_to do |format|
      if @item_template.update(item_params)
        format.html { redirect_to item_template_url(@item_template), notice: "Item was successfully updated." }
        format.json { render :show, status: :ok, location: @item_template }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @item_template.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /items/1 or /items/1.json
  def destroy
    @item_template.destroy!

    respond_to do |format|
      format.html { redirect_to item_templates_url, notice: "Item was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item_template = ItemTemplate.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def item_params
      params.require(:item_template).permit(
        :uuid, :name, :type,
        :description, :min_level,
        :vocation, :two_hands, :attack,
        :weight, :mergeable,
        :heal_hp, :image, :defense,
        :vocation
      )
    end

end
