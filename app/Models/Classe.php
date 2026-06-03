<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'filiere',
        'formateur_id',
    ];

    /**
     * Le formateur qui gère cette classe.
     */
    public function formateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }

    /**
     * Les stagiaires de cette classe.
     */
    public function stagiaires(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'classe_stagiaire', 'classe_id', 'stagiaire_id')
                    ->withTimestamps();
    }

    /**
     * Les présentations de cette classe.
     */
    public function presentations(): HasMany
    {
        return $this->hasMany(Presentation::class);
    }
}
