"""add is_active to categories

Revision ID: 9dde7a26adb4
Revises: 7a1c9f2e4b3d
Create Date: 2026-09-18 18:00:47.156190
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '9dde7a26adb4'
down_revision: Union[str, Sequence[str], None] = '7a1c9f2e4b3d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    
    op.add_column(
        'categories',
        sa.Column(
            'is_active',
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        )
    )


def downgrade() -> None:
    
    op.drop_column('categories', 'is_active')