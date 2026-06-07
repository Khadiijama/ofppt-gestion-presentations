<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Presentation extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'date_limite',
        'classe_id',
        'formateur_id',
    ];

    protected function casts(): array
    {
        return [
            'date_limite' => 'datetime',
        ];
    }
    /**
     * La classe à laquelle appartient cette présentation.
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }
    /**
     * Le formateur qui a créé cette présentation.
     */
    public function formateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }
    /**
     * Les assignations de cette présentation.
     */
    public function assignations(): HasMany
    {
        return $this->hasMany(Assignation::class);
    }
    /**
     * Les stagiaires assignés à cette présentation.
     */
    public function stagiaires(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'assignations', 'presentation_id', 'stagiaire_id')
                    ->withTimestamps();
    }

    /**
     * Les fichiers uploadés pour cette présentation.
     */
    public function uploads(): HasMany
    {
        return $this->hasMany(Upload::class);
    }
}
