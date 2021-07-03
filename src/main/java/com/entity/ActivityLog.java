package com.entity;

import java.sql.Date;
import java.time.LocalDate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;

@Entity
public @Data class ActivityLog {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY) 
	public long id;
	@Column(
			name = "created_on",
		    nullable = false
	)
	public Date createdDate = Date.valueOf( LocalDate.now());  
    

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "act_group_id", nullable =  false, referencedColumnName = "id")
 
	public ActGroup actGroup;
}


