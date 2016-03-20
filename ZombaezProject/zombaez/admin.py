from django.contrib import admin
from zombaez.models import User, Game, Badge

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'zombies_killed', 'total_games_played',
            'total_ammo_collected', 'largest_party_size', 'total_food_collected',
            'total_days_survived'#, 'avatar'
    )

class BadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'description', 'level', 'name',
            'image', 'requirements'
    )

class GameAdmin(admin.ModelAdmin):
    list_display = ('user','game_state','update_state','player_state')

admin.site.register(User, UserAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(Badge, BadgeAdmin)
