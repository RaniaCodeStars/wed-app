"""add delivery prices

Revision ID: 422154b86d56

Revises: 9dde7a26adb4

Create Date: 2026-09-19 00:44:51.977097

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '422154b86d56'
down_revision: Union[str, Sequence[str], None] = '9dde7a26adb4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        'delivery_prices',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('wilaya', sa.String(), nullable=False),
        sa.Column('home_price', sa.Float(), nullable=False),
        sa.Column('office_price', sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('wilaya')
    )

    op.create_index(
        op.f('ix_delivery_prices_id'),
        'delivery_prices',
        ['id'],
        unique=False
    )

    op.add_column(
    'orders',
    sa.Column(
        'delivery_fee',
        sa.Float(),
        nullable=False,
        server_default=sa.text('0')
    )
)


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column('orders', 'delivery_fee')

    op.drop_index(
        op.f('ix_delivery_prices_id'),
        table_name='delivery_prices'
    )

    op.drop_table('delivery_prices')