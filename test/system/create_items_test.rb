require "application_system_test_case"

class CreateItemsTest < ApplicationSystemTestCase
  setup do
    @create_item = create_items(:one)
  end

  test "visiting the index" do
    visit create_items_url
    assert_selector "h1", text: "Create items"
  end

  test "should create create item" do
    visit create_items_url
    click_on "New create item"

    click_on "Create Create item"

    assert_text "Create item was successfully created"
    click_on "Back"
  end

  test "should update Create item" do
    visit create_item_url(@create_item)
    click_on "Edit this create item", match: :first

    click_on "Update Create item"

    assert_text "Create item was successfully updated"
    click_on "Back"
  end

  test "should destroy Create item" do
    visit create_item_url(@create_item)
    click_on "Destroy this create item", match: :first

    assert_text "Create item was successfully destroyed"
  end
end
