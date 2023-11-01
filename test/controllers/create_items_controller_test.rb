require "test_helper"

class CreateItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @create_item = create_items(:one)
  end

  test "should get index" do
    get create_items_url
    assert_response :success
  end

  test "should get new" do
    get new_create_item_url
    assert_response :success
  end

  test "should create create_item" do
    assert_difference("CreateItem.count") do
      post create_items_url, params: { create_item: {  } }
    end

    assert_redirected_to create_item_url(CreateItem.last)
  end

  test "should show create_item" do
    get create_item_url(@create_item)
    assert_response :success
  end

  test "should get edit" do
    get edit_create_item_url(@create_item)
    assert_response :success
  end

  test "should update create_item" do
    patch create_item_url(@create_item), params: { create_item: {  } }
    assert_redirected_to create_item_url(@create_item)
  end

  test "should destroy create_item" do
    assert_difference("CreateItem.count", -1) do
      delete create_item_url(@create_item)
    end

    assert_redirected_to create_items_url
  end
end
