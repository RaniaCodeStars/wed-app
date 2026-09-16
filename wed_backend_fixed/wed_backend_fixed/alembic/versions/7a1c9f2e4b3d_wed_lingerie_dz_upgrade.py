"""Wed Lingerie DZ upgrade : commune/delivery_type/payment sur Order, is_active/is_available
sur Product, role sur User, suppression de la table cart_items (panier desormais 100% localStorage
cote frontend Next.js).

Revision ID: 7a1c9f2e4b3d
Revises: 5c9495594dca
Create Date: 2026-09-07 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '7a1c9f2e4b3d'
down_revision: Union[str, Sequence[str], None] = '5c9495594dca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- users : nouveau champ role (sous-role admin, ex: "admin", "confirmatrice") ---
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(sa.Column("role", sa.String(), nullable=True))

    # --- products : soft-delete + toggle "rupture de stock" + horodatage de création ---
    with op.batch_alter_table("products", schema=None) as batch_op:
        batch_op.add_column(sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()))
        batch_op.add_column(sa.Column("is_available", sa.Boolean(), nullable=False, server_default=sa.true()))
        batch_op.add_column(sa.Column("created_at", sa.DateTime(), nullable=True))

    # --- orders : infos de livraison capturées au checkout (auparavant absentes de la table) ---
    with op.batch_alter_table("orders", schema=None) as batch_op:
        batch_op.alter_column("user_id", existing_type=sa.Integer(), nullable=True)
        batch_op.add_column(sa.Column("customer_name", sa.String(), nullable=False, server_default=""))
        batch_op.add_column(sa.Column("phone", sa.String(), nullable=False, server_default=""))
        batch_op.add_column(sa.Column("wilaya", sa.String(), nullable=False, server_default=""))
        batch_op.add_column(sa.Column("commune", sa.String(), nullable=False, server_default=""))
        batch_op.add_column(sa.Column("delivery_type", sa.String(), nullable=False, server_default="domicile"))
        batch_op.add_column(sa.Column("address", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("office_name", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("payment_method", sa.String(), nullable=False, server_default="cod"))

    # --- cart_items : supprimée, le panier est désormais géré 100% côté frontend (localStorage) ---
    op.drop_table("cart_items")


def downgrade() -> None:
    op.create_table(
        "cart_items",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("session_id", sa.String(), nullable=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("selected_size", sa.String(), nullable=True),
        sa.Column("selected_color", sa.String(), nullable=True),
    )

    with op.batch_alter_table("orders", schema=None) as batch_op:
        batch_op.drop_column("payment_method")
        batch_op.drop_column("office_name")
        batch_op.drop_column("address")
        batch_op.drop_column("delivery_type")
        batch_op.drop_column("commune")
        batch_op.drop_column("wilaya")
        batch_op.drop_column("phone")
        batch_op.drop_column("customer_name")
        batch_op.alter_column("user_id", existing_type=sa.Integer(), nullable=False)

    with op.batch_alter_table("products", schema=None) as batch_op:
        batch_op.drop_column("created_at")
        batch_op.drop_column("is_available")
        batch_op.drop_column("is_active")

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_column("role")
