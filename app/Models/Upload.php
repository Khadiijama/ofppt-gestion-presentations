<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Upload extends Model
{
    use HasFactory;

    protected $fillable = [
        'presentation_id',
        'stagiaire_id',
        'file_path',
        'nom_original',
        'uploaded_at',
    ];

    protected function casts(): array
    {
        return [
            'uploaded_at' => 'datetime',
        ];
    }

    /**
     * La présentation concernée.
     */
    public function presentation(): BelongsTo
    {
        return $this->belongsTo(Presentation::class);
    }

    /**
     * Le stagiaire qui a uploadé le fichier.
     */
    public function stagiaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'stagiaire_id');
    }
}
