resource "aws_dynamodb_table" "peakcore_users_table" {
    name = "peakcore-users-table"
    billing_mode = "PAY_PER_REQUEST"
    hash_key = "user_id"

    attribute {
        name = "user_id"
        type = "S"
    }
}